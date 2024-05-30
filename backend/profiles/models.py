from django.db import models
from django.contrib.auth.models import User

class Photo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="uploads/")
    label = models.CharField(max_length=100, blank=True, default="")

    def __str__(self):
        return f"{self.id}"
