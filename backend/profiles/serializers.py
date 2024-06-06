from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Photo, Dataset, Task, Training
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
        fields = ["id", "user", "name", "photos", "description", "created_at", "public"]
        read_only_fields = ["id", "user", "created_at"]

class DatasetPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ["id", "user", "name", "description", "created_at", "public"]
        read_only_fields = fields

class UserPublicInfoSerializer(serializers.ModelSerializer):
    public_datasets = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "public_datasets"]

    def get_public_datasets(self, obj):
        datasets = Dataset.objects.filter(user=obj, public=True)
        return DatasetPublicSerializer(datasets, many=True).data

class PhotoLabelUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ["label"]

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["task_id", "status", "created_at"]

class TrainingSerializer(serializers.ModelSerializer):
    keywords = serializers.ListField(
        child=serializers.CharField(max_length=20),
        allow_empty=False,
        max_length=10,
    )

    class Meta:
        model = Training
        fields = ["id", "dataset", "created_at", "task_id", "keywords"]
        read_only_fields = ["id", "dataset", "created_at", "task_id"]

    def validate_keywords(self, value):
        if len(value) > 10:
            raise serializers.ValidationError("You can specify up to 10 keywords.")
        for keyword in value:
            if len(keyword) > 20:
                raise serializers.ValidationError("Each keyword can be up to 20 characters long.")
        return value

    def create(self, validated_data):
        keywords = validated_data.pop("keywords")
        keywords_str = ",".join(keywords)
        training = Training.objects.create(keywords=keywords_str, **validated_data)
        return training

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['keywords'] = instance.keywords.split(',')
        return representation
