# ObjdumpAI

ObjdumpAI is a full-stack web application that brings the computer vision community together with accessible object detection model training and AI powered data labeling.

## Features

- __Image Datasets:__ Users can create datasets by uploading their own images of any size and common type.

- __AI Labeling:__ With an existing dataset, users can have objects within their images automatically boxed and labeled from a set of user-supplied keywords by GroundingDINO, a transformer based encoder, decoder model.

- __AI Image Tagging:__ Users can choose to have the images in their dataset automatically described with short sentences. These image tags serve as helpful search terms.

- __Custom Model Training:__ Train a fully customizable object detection neural network on a dataset with a set of user-supplied object keywords as many times as needed.

- __Public Dataset Search:__ Datasets can be optionally made public, allowing their descriptions and AI-generated tags to fuel a global search. Users can enter search terms and receive a list of datasets ranked by relevance. This feature enables users to discover datasets from others that match their interests, and view the profiles of dataset owners to explore their other public datasets.

## Notice

AI-related tasks will perform significantly faster with an NVIDIA GPU, development was done on an RTX 3090 with cuda 12.2

## Setup

In order to run a local instance of ObjdumpAI, first clone this repository.
All setup anticipates a Linux environment. Windows users should use WSL.

### Running with Docker
The `./run.sh DOCKER` script will detect if an NVIDIA GPU is present and attempt to run the Docker setup
with GPU pass-through. The GPU Dockerfile requires CUDA 12.2, but it can be manually edited in
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
To run the CPU Docker without `./run.sh DOCKER`, you can simply run `docker compose up --build` in the root directory of the repository. Note that if one of the required ports is already being used, which is a common issue if you have a system wide `redis` running, the Docker run will fail, and you will need to end this local `redis` instance first.
Even with GPU pass-through, running on Docker will be significantly slower than running each component on your host machine.
If you try mixing runs with Docker and without Docker, permissions on `backend/db.sqlite3` and files within `backend/protected_media` may cause issues, so it's reccommended to not mix runs, and if you do, change the owner on all of these files to your user (or just delete them), since within Docker they will be created and written to as root.

### Running without Docker
If you are on a Linux system with sufficient packages, Docker may not be needed.
Verify that you have the correct packages by inspecting the requirements of `backend/Dockerfile.cpu`,
and additionally ensure that you have the `redis` and `celery` packages as well as a recent `nodejs` version with `npm`.

Running `./run.sh` (without the DOCKER argument) will attempt to start each required component on the host machine. If you are having issues with this,
you can see below how individual components can be run.

The frontend component can be run as follows:
```bash
cd frontend
npm install
npm start
```
The frontend Dockerfile can also be used individually, and this is reccommended
due to the unreliability of `npm`. This can be done with the following command:
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

Celery will require a local `redis` server on port `6379`.
This can be started with `redis-server` if the `redis` package is installed on Debian.

The frontend will be accessible in a browser at `http://localhost:3000` after proper setup.

## Technologies
- React
- Django
- SQLite
- Celery
- Redis
- GroundingDINO
- BLIP

## Authors

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

__ObjdumpAI__ was developed as a final project for CS 35L taught by Professor Paul Eggert at UCLA in Spring 2024. Made by: Sean Son, Brian Hong, David Wang, Enzo Saracen.
