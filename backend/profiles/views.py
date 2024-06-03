from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import UserSerializer, PhotoSerializer, DatasetSerializer
from .models import Photo, Dataset, Task
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .tasks import train_model
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

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class TrainInitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        dataset_id = self.kwargs["dataset_id"]
        try:
            dataset = Dataset.objects.get(id=dataset_id, user=user)
        except Dataset.DoesNotExist:
            return Response({"error": "Dataset not found or does not belong to  the user."}, status=status.HTTP_404_NOT_FOUND)
        
        task = train_model.delay(user.id, dataset.id)
        Task.objects.create(user=user, dataset=dataset, task_id=task.id, status="pending")
        return Response({"task_id": task.id}, status=status.HTTP_202_ACCEPTED)

class TrainStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, dataset_id, task_id=None):
        if task_id:
            task_result = AsyncResult(task_id)
        else:
            try:
                task_instance = Task.objects.filter(user=request.user, dataset_id=dataset_id).latest("created_at")
                task_result = AsyncResult(task_instance.task_id)
            except Task.DoesNotExist:
                return Response({"error": "No tasks found for the given dataset"}, status=status.HTTP_404_NOT_FOUND)
        if task_result.state == "pending":
            response = {
                "state": task_result.state,
                "current": task_result.info.get("current", 0),
                "total": task_result.info.get("total", 1),
                "status": "In progress...",
            }
        elif task_result.state == "success":
            response = {
                "state": task_result.state,
                "result": task_result.result,
            }
        else:
            response = {
                "state": task_result.state,
                "status": str(task_result.info),
            }
        return Response(response)

class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, dataset_id):
        user = request.user
        try:
            dataset = Dataset.objects.get(id=dataset_id, user=user)
        except Dataset.DoesNotExist:
            return Response({"error": "Dataset not found or does not belong to the user"}, status=status.HTTP_404_NOT_FOUND)
        tasks = Task.objects.filter(user=user, dataset=dataset)
        tasks_data = [
            {
                "task_id": task.task_id,
                "status": task.status,
                "created_at": task.created_at,
            }
            for task in tasks
        ]
        return Response(tasks_data, status=status.HTTP_200_OK)
