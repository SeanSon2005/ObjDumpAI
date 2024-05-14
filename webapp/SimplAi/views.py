from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm, UserLoginForm, ImageUploadForm
from django.contrib import messages

def register(request):
    if request.method == "POST":
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            messages.success(request, f"account created for {username}")
            return redirect("login")
    else:
        form = UserRegisterForm()
    return render(request, "SimplAi/register.html", {"form": form})

def user_login(request):
    if request.method == "POST":
        form = UserLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("profile")
            else:
                messages.error(request, "invalid username or password")
    else:
        form = UserLoginForm()
    return render(request, "SimplAi/login.html", {"form": form})

@login_required
def upload_image(request):
    if request.method == "POST":
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            user_image = form.save(commit=False)
            user_image.user = request.user
            user_image.save()
            messages.success(request, "image uploaded successfully!")
            return redirect("profile")
    else:
        form = ImageUploadForm()
    return render(request, "SimplAi/upload.html", {"form": form})

def user_logout(request):
    logout(request)
    return redirect("login")

def profile(request):
    return render(request, "SimplAi/profile.html")
