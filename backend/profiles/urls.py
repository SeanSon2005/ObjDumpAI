from django.urls import path
from .views import UserCreate, PhotoList, DatasetDetail, DatasetList, TrainInitView, TrainStatusView, TaskListView
from rest_framework.authtoken.views import ObtainAuthToken

urlpatterns = [
    path("register/", UserCreate.as_view(), name="register"),
    path("login/", ObtainAuthToken.as_view(), name="login"),
    path("datasets/", DatasetList.as_view(), name="dataset-list"),
    path("datasets/<int:pk>/detail/", DatasetDetail.as_view(), name="dataset-detail"),
    path("datasets/<int:dataset_id>/photos/", PhotoList.as_view(), name="photo-list"),
    path("datasets/<int:dataset_id>/tasks/train/", TrainInitView.as_view(), name="train-init"),
    path("datasets/<int:dataset_id>/tasks/status/", TrainStatusView.as_view(), name="train-status"),
    path("datasets/<int:dataset_id>/tasks/status/<str:task_id>/", TrainStatusView.as_view(), name="train-status-by-id"),
    path("datasets/<int:dataset_id>/tasks/list/", TaskListView.as_view(), name="task-list"),
]
