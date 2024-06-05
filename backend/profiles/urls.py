from django.urls import path
from .views import UserCreate, PhotoList, DatasetDetail, DatasetList, PhotoLabelUpdateView, PhotoDeleteView, DatasetReadonlyView, TogglePublicityView, DatasetSearchView, TaskStatusView, DatasetLabelerView
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
    path("tasks/<str:task_id>/status/", TaskStatusView.as_view(), name="task_status"),
]
