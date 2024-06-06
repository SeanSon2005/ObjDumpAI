from django.urls import path
from .views import UserCreate, PhotoList, DatasetDetail, DatasetList, PhotoLabelUpdateView, PhotoDeleteView, DatasetReadonlyView, TogglePublicityView, DatasetSearchView, TaskStatusView, DatasetLabelerView, UserPublicInfoView, DatasetPublicView, TrainingInitView, TrainingListView, TrainingDeleteView, TrainingView, TrainingLiveView
from rest_framework.authtoken.views import ObtainAuthToken

urlpatterns = [
    path("register/", UserCreate.as_view(), name="register"),
    path("login/", ObtainAuthToken.as_view(), name="login"),
    path("datasets/", DatasetList.as_view(), name="dataset-list"),
    path("photos/<int:photo_id>/", PhotoLabelUpdateView.as_view(), name="photo-label-update"),
    path("photos/<int:photo_id>/delete/", PhotoDeleteView.as_view(), name="photo-delete"),
    path("datasets/<int:pk>/detail/", DatasetDetail.as_view(), name="dataset-detail"),
    path("datasets/<int:dataset_id>/photos/", PhotoList.as_view(), name="photo-list"),
    path("datasets/<int:pk>/readonly/", DatasetReadonlyView.as_view(), name="dataset-readonly-detail"),
    path("datasets/<int:pk>/toggle-publicity/", TogglePublicityView.as_view(), name="dataset-toggle-publicity"),
    path("datasets/search/", DatasetSearchView.as_view(), name="dataset-search"),
    path("datasets/<int:dataset_id>/labeler/", DatasetLabelerView.as_view(), name="dataset-labeler"),
    path("datasets/<int:pk>/public/", DatasetPublicView.as_view(), name="dataset-public"),
    path("tasks/<str:task_id>/status/", TaskStatusView.as_view(), name="task-status"),
    path("user/<int:id>/public-info/", UserPublicInfoView.as_view(), name="user-public-info"),
    path("datasets/<int:dataset_id>/train/", TrainingInitView.as_view(), name="init-training"),
    path("datasets/<int:dataset_id>/trainings/", TrainingListView.as_view(), name="list-training"),
    path("datasets/<int:dataset_id>/trainings/delete/<int:pk>/", TrainingDeleteView.as_view(), name="delete-training"),
    path("trainings/<int:training_id>/", TrainingView.as_view(), name="view-training"),
    path("trainings/<int:training_id>/live/",TrainingLiveView.as_view(), name="live-training"),
]
