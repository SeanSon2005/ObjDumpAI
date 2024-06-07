#!/bin/bash

cleanup() {
	echo "Cleaning up"
	kill $(jobs -p)
	exit 0
}

run_on_host() {
	echo "Running components on the host machine..."

	echo "Starting Redis server"
	redis-server &

	echo "Starting backend server"
	cd backend
	pipenv install
	pipenv run python manage.py migrate
	pipenv run python manage.py runserver &
	echo "Starting Celery"
	pipenv run python manage.py start_celery &
	cd ..

	echo "Starting frontend"
	cd frontend
	npm install
	npm start &
	cd ..
	echo "Visit http://localhost:3000 in a browser"
}

trap cleanup SIGINT SIGTERM EXIT

if [ "$1" = "DOCKER" ]; then
	if command -v nvidia-smi &> /dev/null; then
		echo "NVIDIA GPU detected."
		export DOCKERFILE=Dockerfile.gpu
		docker compose -f docker-compose.gpu.yml -f docker-compose.yml up --build
	else
		echo "NVIDIA GPU not detected."
		export DOCKERFILE=Dockerfile.cpu
		docker compose up --build
	fi
	exit 0
fi

run_on_host
wait
exit 0
