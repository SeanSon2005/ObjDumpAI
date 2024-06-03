from celery import shared_task, current_task
from .models import Task
from django.conf import settings
import os
import sys
import time
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

pipeline_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../pipeline"))
if pipeline_path not in sys.path:
    sys.path.append(pipeline_path)

#import pipeline

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
