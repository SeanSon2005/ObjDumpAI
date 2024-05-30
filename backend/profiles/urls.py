from django.urls import path
from .views import UserList, UserDetail, UserCreate, PhotoList
from rest_framework.authtoken.views import ObtainAuthToken

urlpatterns = [
    path("register/", UserCreate.as_view(), name="register"),
    path("photos/", PhotoList.as_view(), name="photo-list"),
    path("login/", ObtainAuthToken.as_view(), name="login"),
    path("users/", UserList.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetail.as_view(), name="user-detail"),
]
