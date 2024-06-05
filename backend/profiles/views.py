from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer, PhotoSerializer, DatasetSerializer, PhotoLabelUpdateSerializer, TaskSerializer
from .models import Photo, Dataset, Task
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
        return Dataset.objects.filter(Q(user=user) | Q(public=True))

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

class PhotoList(generics.ListCreateAPIView):
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        dataset_id = self.kwargs["dataset_id"]
        return Photo.objects.filter(dataset__id=dataset_id, dataset__user=self.request.user)

    def perform_create(self, serializer):
        dataset_id = self.kwargs["dataset_id"]
        dataset = Dataset.objects.get(id=dataset_id, user=self.request.user)
        serializer.save(dataset=dataset)

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
    serializer_class = DatasetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get("query", None)
        if query is None:
            return Dataset.objects.none()
        datasets = Dataset.objects.filter(
            Q(description__icontains=query) | Q(photos__label__icontains=query),
            user=self.request.user
        ).distinct()

        return datasets

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        query = request.query_params.get("query", "")

        results = []
        for dataset in queryset:
            description_match_count = dataset.description.lower().count(query.lower())
            photo_match_count = sum([photo.label.lower().count(query.lower()) for photo in dataset.photos.all()])
            total_match_count = description_match_count + photo_match_count
            results.append((total_match_count, dataset))

        results.sort(key=lambda x: x[0], reverse=True)
        datasets = [dataset for _, dataset in results]

        response_data = []
        for relevance_score, dataset in results:
            dataset_data = DatasetSerializer(dataset).data
            dataset_data['relevance_score'] = relevance_score
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
