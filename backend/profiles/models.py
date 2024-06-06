from django.db import models
from django.contrib.auth.models import User
from .storage import ProtectedMediaStorage
from django.core.exceptions import ValidationError

def user_directory_path(instance, filename):
    return f"{instance.dataset.user.id}/{instance.dataset.id}/{filename}"

class Dataset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=32)
    description = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    public = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Photo(models.Model):
    dataset = models.ForeignKey(Dataset, related_name="photos", on_delete=models.CASCADE)
    image = models.ImageField(upload_to=user_directory_path, storage=ProtectedMediaStorage)
    label = models.CharField(max_length=80, blank=True, default="")

    def __str__(self):
        return f"{self.id}"

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dataset = models.ForeignKey("Dataset", on_delete=models.CASCADE)
    task_id = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.task_id

class Training(models.Model):
    dataset = models.ForeignKey(Dataset, related_name="trainer", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, default="PENDING")
    keywords = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return f"{self.id}"

    def clean(self):
        keywords_list = self.keywords.split(',')
        if len(keywords_list) > 10:
            raise ValidationError("You can specify up to 10 keywords.")
        for keyword in keywords_list:
            if len(keyword) > 20:
                raise ValidationError("Each keyword can be up to 20 characters long.")
