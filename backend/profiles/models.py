from django.db import models
from django.contrib.auth.models import User
from .storage import ProtectedMediaStorage

def user_directory_path(instance, filename):
    return f"{instance.dataset.user.id}/{instance.dataset.id}/{filename}"

class Dataset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Photo(models.Model):
    dataset = models.ForeignKey(Dataset, related_name="photos", on_delete=models.CASCADE)
    image = models.ImageField(upload_to=user_directory_path, storage=ProtectedMediaStorage)
    label = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return f"{self.id}"
