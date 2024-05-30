from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Photo, Dataset

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ["id", "dataset", "image", "label"]
        read_only_fields = ["dataset"]

class DatasetSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Dataset
        fields = ["id", "user", "name", "photos"]
        read_only_fields = ["user"]
