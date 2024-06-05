from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Photo, Dataset
import os

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PhotoSerializer(serializers.ModelSerializer):
    filename = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = ["id", "dataset", "image", "label", "filename"]
        read_only_fields = ["id", "dataset"]

    def get_filename(self, obj):
        return os.path.basename(obj.image.name)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user_id = instance.dataset.user.id
        dataset_id = instance.dataset.id
        filename = os.path.basename(instance.image.name)
        representation["image"] = f"/protected_media/{user_id}/{dataset_id}/{filename}"
        return representation

class DatasetSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Dataset
        fields = ["id", "user", "name", "photos", "description", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

class PhotoLabelUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ["label"]
