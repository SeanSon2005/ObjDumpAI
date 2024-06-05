from celery import shared_task, current_task
from .models import Task, Photo
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import os
import sys
import time
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

pipeline_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../pipeline"))
if pipeline_path not in sys.path:
    sys.path.append(pipeline_path)

import pipeline

@shared_task
def cleanup_failed_tasks():
    threshold = timezone.now() - timedelta(minutes=10)
    failed_tasks = Task.objects.filter(status="FAILURE", created_at__lt=threshold)
    count = failed_tasks.count()
    failed_tasks.delete()
    logger.info(f"Deleted {count} failed tasks older than {threshold}")

@shared_task(bind=True)
def train_model(self, user_id, dataset_id):
    return {"message": "unimplemented"}
    #try:
    #    pipeline_instance = pipeline.Pipeline()
    #    config_path = os.path.join(settings.PROTECTED_MEDIA_ROOT, f"{user_id}/{dataset_id}/config.yaml")
    #    pipeline_instance.train(config_path)
    #    task_instance = Task.objects.get(task_id=self.request.id)
    #    task_instance.status = "SUCCESS"
    #    task_instance.save()
    #    return {"message": "Training completed successfully."}
    #except Exception as e:
    #    task_instance = Task.objects.get(task_id=self.request.id)
    #    task_instance.status = "FAILURE"
    #    task_instance.save()
    #    logger.error(f"Training failed: {str(e)}")
#    return self.retry(exc=e)

@shared_task(bind=True, max_retries=0)
def label_dataset(self, user_id, dataset_id):
    try:
        pipeline_instance = pipeline.Pipeline()
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
        return {"message": "Labeling failed", "error": str(e)}
