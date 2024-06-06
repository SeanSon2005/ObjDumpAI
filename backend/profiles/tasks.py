from celery import shared_task, current_task
from .models import Task, Photo, Training
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import os
import sys
import time
import shutil
import yaml
import json
from celery.utils.log import get_task_logger
from .config import DEFAULT_CONFIG

logger = get_task_logger(__name__)

pipeline_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../pipeline"))
if pipeline_path not in sys.path:
    sys.path.append(pipeline_path)

import pipeline

@shared_task
def cleanup_failed_tasks():
    threshold = timezone.now() - timedelta(minutes=30)
    failed_tasks = Task.objects.filter(created_at__lt=threshold)
    count = failed_tasks.count()
    failed_tasks.delete()
    logger.info(f"Deleted {count} tasks older than {threshold}")

@shared_task(bind=True, max_retries=0)
def train_model(self, training_id):
    try:
        training_instance = Training.objects.get(id=training_id)
        dataset = training_instance.dataset
        user_id = dataset.user.id
        dataset_id = dataset.id
        training_dir = os.path.join(settings.PROTECTED_MEDIA_ROOT, f"training/{user_id}/{dataset_id}/{training_id}/")

        os.makedirs(os.path.join(training_dir, "images"), exist_ok=True)
        os.makedirs(os.path.join(training_dir, "annotated_images"), exist_ok=True)
        os.makedirs(os.path.join(training_dir, "labels"), exist_ok=True)
        os.makedirs(os.path.join(training_dir, "live_data"), exist_ok=True)
        os.makedirs(os.path.join(training_dir, "runs"), exist_ok=True)

        for photo in dataset.photos.all():
            shutil.copy(photo.image.path, os.path.join(training_dir, "images"))

        pipeline_instance = pipeline.Pipeline(training_dir)

        config = DEFAULT_CONFIG
        config["data_loader"]["args"]["data_dir"] = training_dir
        config["trainer"]["save_dir"] = os.path.join(training_dir, "runs")
        config_path = os.path.join(training_dir, "config.yaml")
        with open(config_path, "w") as config_file:
            yaml.dump(config, config_file)

        queries = training_instance.keywords.split(",")
        pipeline_instance.generate_labels(queries=queries, force=False)
        pipeline_instance.train(path_to_config=config_path)
        training_instance.status = "COMPLETED"
        training_instance.save()
        return {"message": "Training completed successfully."}

    except Exception as e:
        training_instance.status = "FAILED"
        training_instance.save()
        logger.error(f"Training failed: {str(e)}")
        return {"message": "Training failed", "error": str(e)}

@shared_task(bind=True, max_retries=0)
def label_dataset(self, user_id, dataset_id):
    try:
        pipeline_instance = pipeline.Pipeline(".")
        img_path = os.path.join(settings.PROTECTED_MEDIA_ROOT, f"{user_id}/{dataset_id}/")
        tags = pipeline_instance.generate_tags(img_path)
        
        for image_name, image_tag in tags:
            try:
                photo = Photo.objects.get(dataset_id=dataset_id, image__icontains=image_name)
                if len(image_tag) > 80:
                    image_tag = image_tag[:80]
                photo.label = image_tag
                photo.save()
            except Photo.DoesNotExist:
                logger.warning(f"Photo with name {image_name} not found in dataset {dataset_id}.")
        
        task_instance = Task.objects.get(task_id=self.request.id)
        task_instance.status = "SUCCESS"
        task_instance.save()
        return {"message": "Labeling completed successfully."}
    except Exception as e:
        task_instance = Task.objects.get(task_id=self.request.id)
        task_instance.status = "FAILURE"
        task_instance.save()
        logger.error(f"Labeling failed: {str(e)}")
        return {"message": "Labeling failed.", "error": str(e)}
