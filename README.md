# ObjdumpAI

ObjdumpAI is a full-stack web application that brings the computer vision community together with accessible object detection model training and AI powered data labeling.

## Features

- __Image Datasets:__ Users can create datasets by uploading their own images of any size and common type
- __AI Labeling:__ With an existing dataset, users can have their images automatically labeled by GroundingDINO, a transformer based encoder, decorder model.
- __AI Image Descriptions:__ Automatically generate a sentence describing the user's images in detail, offering ideas on objects to look for and serving as a tag to search for specific images in your dataset.
- __Custom Model Training:__ Modify and train a fully customizable object detection neural network on any dataset and as many times as needed with different object keywords.
- __Public Dataset Search:__ Datasets can be optionally made public, allowing their descriptions and AI-generated tags to fuel a global search. Users can enter search terms and receive a list of datasets ranked by relevance. This feature enables users to discover datasets from others that match their interests, and view the profiles of dataset owners to explore their other public datasets.

## Notice

- AI tasks will benefit greatly from a GPU, development was done on an RTX 3090 with cuda 12.2
- Please allocate enough compute for a smooth experience.

## Technologies
- React
- Django
- SQLite
- Celery
- Redis
- GroundingDINO
- BLIP

## Setup

In order to run a local instance of ObjdumpAI, first clone or download a copy of this repository.
All setup anticipates a Linux environment. Windows users should use WSL.

### Running with Docker
The `./run.sh` script will detect if an NVIDIA GPU is present and attempt to run the Docker setup
with GPU passthrough. The GPU Dockerfile requires CUDA 12.2, but it can be manually edited in
`backend/Docker.gpu` to fit your CUDA version (although the AI pipeline may not support certain older CUDA versions).
Using the GPU Dockerfile requires the nvidia-docker2 package.
For Debian based distributions, it can be installed as follows:
```bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID) && curl -s -L https://nvidia.github.io/libnvidia-container/gpgkey | sudo apt-key add - && curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update

sudo apt-get install -y nvidia-docker2

sudo systemctl restart docker
```
If an NVIDIA GPU is not detected, the Docker will be run with CPU only.
To run the CPU Docker without `./run.sh`, you can simply run `docker compose up --build` in the root directory of the repository.
Note that even with GPU passthrough, running on Docker will be significantly slower than running each component directly.

### Running without Docker
If you are on a Linux system with sufficient packages, Docker may not be needed.
Verify that you have the correct packages by inspecting the requirements of `backend/Dockerfile.cpu`,
and additionally ensure that you have the `redis` and `celery` packages as well as a recent `nodejs` version with `npm`.

The frontend component can be run as follows:
```bash
cd frontend
npm install
npm start
```
The frontend Dockerfile can also be used individually, and this is reccommended
due to the ridiculousness of `npm`. This can be done with the following command:
`docker run -p 3000:80 $(docker build -q ./frontend)`

The backend server can be run as follows:
```bash
cd backend
pipenv shell
python manage.py migrate
python manage.py runserver
```

The celery instance can be run as follows:
```bash
cd backend
pipenv shell
python manage.py start_celery
```

There additionally must be a local `redis` server on port `6379`.
This can be started with `redis-server` if the `redis` package is installed on Debian.

The frontend will be accessible in a browser at `http://localhost:3000` after proper setup.

## Authors

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

__ObjDumpAI__ was developed as a final project for CS 35L taught by Professor Paul Eggert at UCLA in Spring 2024. Made by: Sean Son, Brian Hong, David Wang, Enzo Saracen.
