from django.urls import path
from .views import UserList, UserDetail, UserCreate, PhotoList, DatasetDetail, DatasetList
from rest_framework.authtoken.views import ObtainAuthToken

urlpatterns = [
    path("register/", UserCreate.as_view(), name="register"),
    path("login/", ObtainAuthToken.as_view(), name="login"),
    path("datasets/", DatasetList.as_view(), name="dataset-list"),
    path("datasets/<int:dataset_id>/photos/", PhotoList.as_view(), name="photo-list"),
    path("users/", UserList.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetail.as_view(), name="user-detail"),
]
