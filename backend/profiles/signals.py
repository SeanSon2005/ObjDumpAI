from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Dataset, Photo
from django.conf import settings
import shutil
import os
from pathlib import Path

@receiver(post_delete, sender=Photo)
def delete_photo_files(sender, instance, **kwargs):
    instance.image.delete(save=False)

def delete_user_dataset_directory(dataset):
    user_directory = Path(os.path.join(settings.PROTECTED_MEDIA_ROOT, f"{dataset.user.id}/{dataset.id}"))
    if user_directory.exists() and user_directory.is_dir():
        shutil.rmtree(user_directory)

@receiver(post_delete, sender=Dataset)
def delete_dataset_directory(sender, instance, **kwargs):
    delete_user_dataset_directory(instance)
