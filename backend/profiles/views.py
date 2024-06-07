from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer, PhotoSerializer, DatasetSerializer, PhotoLabelUpdateSerializer, TaskSerializer, UserPublicInfoSerializer, DatasetPublicSerializer, TrainingSerializer
from .models import Photo, Dataset, Task, Training
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .tasks import train_model, label_dataset
from django.db.models import Q
from celery.result import AsyncResult
import os
import shutil
import json
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import Http404, FileResponse
from pathlib import Path

class DatasetList(generics.ListCreateAPIView):
    serializer_class = DatasetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Dataset.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DatasetDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DatasetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Dataset.objects.filter(user=self.request.user)

class DatasetReadonlyView(generics.RetrieveAPIView):
    serializer_class = DatasetSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        return Dataset.objects.filter(Q(user=user)|Q(public=True))

class DatasetPublicView(generics.RetrieveAPIView):
    serializer_class = DatasetPublicSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Dataset.objects


class TogglePublicityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            dataset = Dataset.objects.get(pk=pk, user=request.user)
        except Dataset.DoesNotExist:
            return Response({"error": "Dataset not found or does not belong to the user."}, status=status.HTTP_404_NOT_FOUND)
        dataset.public = not dataset.public
        dataset.save()
        return Response({"id": dataset.id, "name": dataset.name, "public": dataset.public}, status=status.HTTP_200_OK)

class UserPublicInfoView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserPublicInfoSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        user_id = self.kwargs.get('id')
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PhotoList(generics.ListCreateAPIView):
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        dataset_id = self.kwargs["dataset_id"]
        try:
            dataset = Dataset.objects.get(id=dataset_id)
        except Dataset.DoesNotExist:
            return Response({"error": "Dataset does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if dataset.user != self.request.user and not dataset.public:
            return Response({"error": "You do not have permission to access this dataset."}, status=status.HTTP_403_FORBIDDEN)

        return Photo.objects.filter(dataset__id=dataset_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if isinstance(queryset, Response):
            return queryset
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        dataset_id = self.kwargs["dataset_id"]
        try:
            dataset = Dataset.objects.get(id=dataset_id)
        except Dataset.DoesNotExist:
            return Response({"error": "Dataset does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if not self.request.user.is_authenticated and not dataset.public:
            return Response({"error": "You do not have permission to add photos to this dataset."}, status=status.HTTP_403_FORBIDDEN)

        if self.request.user.is_authenticated and dataset.user != self.request.user:
            return Response({"error": "You do not have permission to add photos to this dataset."}, status=status.HTTP_403_FORBIDDEN)

        serializer.save(dataset=dataset)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = self.perform_create(serializer)
        if isinstance(response, Response):
            return response
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class TrainingPhotoList(generics.ListAPIView):
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        training_id = self.kwargs["training_id"]
        try:
            training = Training.objects.get(id=training_id)
        except Training.DoesNotExist:
            return Response({"error": "Training instance does not exist."}, status=status.HTTP_404_NOT_FOUND)

        dataset = training.dataset

        if dataset.user != self.request.user and not dataset.public:
            return Response({"error": "You do not have permission to access this dataset."}, status=status.HTTP_403_FORBIDDEN)

        return Photo.objects.filter(dataset__id=dataset.id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if isinstance(queryset, Response):
            return queryset
        
        training_id = self.kwargs["training_id"]
        adjusted_photos = []
        for photo in queryset:
            photo_api = os.path.join(f"/protected_media/training/{photo.dataset.user.id}/{photo.dataset.id}/{training_id}/annotated_images", os.path.basename(photo.image.path))
            photo_path = os.path.join(settings.PROTECTED_MEDIA_ROOT, f"training/{photo.dataset.user.id}/{photo.dataset.id}/{training_id}/annotated_images", os.path.basename(photo.image.path))
            if os.path.exists(photo_path):
                adjusted_photos.append({
                    "id": photo.id,
                    "image": photo_api,
                    "filename": os.path.basename(photo.image.path),
                    "label": photo.label,
                    "dataset": photo.dataset.id,
                })
        return Response(adjusted_photos)

class PhotoLabelUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = PhotoLabelUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Photo.objects.filter(dataset__user=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        return queryset.get(id=self.kwargs["photo_id"])

class PhotoDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Photo.objects.filter(dataset__user=self.request.user)

    def get_object(self):
        queryset = self.get_queryset()
        return queryset.get(id=self.kwargs["photo_id"])

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class DatasetSearchView(generics.ListAPIView):
    serializer_class = DatasetPublicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get("query", None)
        if query is None:
            return Dataset.objects.none()
        query_words = query.split()
        query_filter = Q()
        for word in query_words:
            query_filter |= Q(description__icontains=word) | Q(photos__label__icontains=word)
        datasets = Dataset.objects.filter(
            query_filter,
            Q(public=True),
        ).distinct()
        return datasets

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        query = request.query_params.get("query", "")
        query_words = query.split()

        results = []
        for dataset in queryset:
            description_match_count = sum(dataset.description.lower().count(word.lower()) for word in query_words)
            photo_match_count = sum(photo.label.lower().count(word.lower()) for word in query_words for photo in dataset.photos.all())
            total_match_count = description_match_count + photo_match_count
            results.append((total_match_count, dataset))

        results.sort(key=lambda x: x[0], reverse=True)
        datasets = [dataset for _, dataset in results]

        response_data = []
        for relevance_score, dataset in results:
            dataset_data = DatasetPublicSerializer(dataset).data
            dataset_data["relevance_score"] = relevance_score
            response_data.append(dataset_data)

        return Response(response_data)

class DatasetLabelerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, dataset_id):
        user = request.user
        try:
            dataset = Dataset.objects.get(id=dataset_id, user=user)
        except Dataset.DoesNotExist:
            return Response({"error": "Dataset not found or does not belong to the user."}, status=status.HTTP_404_NOT_FOUND)
        task = label_dataset.delay(user.id, dataset.id)
        Task.objects.create(user=user, dataset=dataset, task_id=task.id, status="PENDING")
        return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)

class TaskStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        try:
            task = Task.objects.get(task_id=task_id, user=request.user)
        except Task.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TrainingInitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, dataset_id):
        try:
            dataset = Dataset.objects.get(id=dataset_id, user=request.user)
        except Dataset.DoesNotExist:
            return Response({"error": "Dataset not found or does not belong to the user."}, status=status.HTTP_404_NOT_FOUND)

        data = {
            "keywords": request.data.get("keywords", [])
        }
        
        serializer = TrainingSerializer(data=data)
        if serializer.is_valid():
            training_instance = serializer.save(dataset=dataset)
            train_model.delay(training_instance.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TrainingDeleteView(generics.DestroyAPIView):
    queryset = Training.objects.all()
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.dataset.user != request.user:
            return Response({"detail": "You do not have permission to delete this training instance."}, status=status.HTTP_403_FORBIDDEN)

        delete_user_training_directory(instance)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

def delete_user_training_directory(training):
    user_directory = Path(os.path.join(settings.PROTECTED_MEDIA_ROOT, f"training/{training.dataset.user.id}/{training.dataset.id}/{training.id}"))
    print(user_directory)
    if user_directory.exists() and user_directory.is_dir():
        shutil.rmtree(user_directory)

class TrainingListView(generics.ListAPIView):
    serializer_class = TrainingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        dataset_id = self.kwargs['dataset_id']
        try:
            dataset = Dataset.objects.get(id=dataset_id)
        except Dataset.DoesNotExist:
            return Response({"error": "Dataset not found."}, status=status.HTTP_404_NOT_FOUND)

        user = self.request.user
        if dataset.user == user or dataset.public:
            return Training.objects.filter(dataset=dataset)
        else:
            return Training.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if isinstance(queryset, Response):
            return queryset
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class TrainingView(APIView):
    serializer_class = TrainingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, training_id):
        try:
            training = Training.objects.get(id=training_id)
            dataset = training.dataset
            user = request.user
            if dataset.user != user and not dataset.public:
                return Response({"error": "Not authorized to view this training instance."}, status=status.HTTP_403_FORBIDDEN)
            live_path = os.path.join(settings.PROTECTED_MEDIA_ROOT, f"training/{user.id}/{dataset.id}/{training.id}/live_data/live.json")
            try:
                with open(live_path, "r") as file:
                    data = json.load(file)
                    training.epochs = int(data["Epoch"])
                    training.save()
            except Exception as e:
                pass
            serializer = self.serializer_class(training)
            return Response(serializer.data)
        except Training.DoesNotExist:
            return Response({"error": "Training instance not found."}, status=status.HTTP_404_NOT_FOUND)

class TrainingLiveView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, training_id):
        training = Training.objects.get(id=training_id)
        dataset = training.dataset
        user = request.user
        if dataset.user != user and not dataset.public:
            return Response({"error": "Not authorized to view this training instance."}, status=status.HTTP_403_FORBIDDEN)

        file_path = os.path.join(settings.PROTECTED_MEDIA_ROOT, f"training/{user.id}/{dataset.id}/{training.id}/live_data/live.json")

        if not os.path.exists(file_path):
            raise Http404("File not found")
        try:
            with open(file_path, "r") as file:
                data = json.load(file)
        except (IOError, ValueError) as e:
            return Response({"detail": "Error reading file"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(data, status=status.HTTP_200_OK)

class TrainingModelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, training_id):
        try:
            training = Training.objects.get(id=training_id)
            dataset = training.dataset
        except Training.DoesNotExist:
            return Response({"error": "Training instance not found."}, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        if dataset.user != user and not dataset.public:
            return Response({"error": "Not authorized to view this training instance."}, status=status.HTTP_403_FORBIDDEN)

        file_path = os.path.join(settings.PROTECTED_MEDIA_ROOT, f"training/{dataset.user.id}/{dataset.id}/{training.id}/last.pth")

        if not os.path.exists(file_path):
            raise Http404("File not found")
        
        try:
            response = FileResponse(open(file_path, "rb"), content_type='application/octet-stream')
            response['Content-Disposition'] = 'attachment; filename="model.pth"'
            return response
        except IOError:
            return Response({"detail": "Error reading file"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
