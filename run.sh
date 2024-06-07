#!/bin/sh

if command -v nvidia-smi &> /dev/null; then
    echo "NVIDIA GPU detected."
    export DOCKERFILE=Dockerfile.gpu
    export NVIDIA_VISIBLE_DEVICES=all
	docker compose -f docker-compose.gpu.yml -f docker-compose.yml up --build
else
    echo "NVIDIA GPU not detected."
    export DOCKERFILE=Dockerfile.cpu
	docker compose up --build
fi
