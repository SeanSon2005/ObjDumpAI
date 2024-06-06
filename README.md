# ObjDumpAI
<img src="logo.png"
    width="500" 
    height="300"
    margin-left="auto"
    margin-right="auto"
    />
ObjDumpAI is a fullstack web application that brings the computer vision community together with accessible object detection model training and AI powered data labeling.

## Features

- __Image Datasets:__ Users can create datasets by uploading their own images of any size and common type
- __AI Labeling:__ With an existing dataset, users can have their images automatically labeled by GroundingDINO, a transformer based encoder, decorder model.
- __AI Image Descriptions:__ Generate a sentence describing the user's images in detail, offering ideas on objects to look for and serving as a tag to search for specific images in your dataset.
- __Custom Model Training:__ Modify and train a fully customizable object detection neural network on any dataset and as many times as needed. 
- __Public Dataset Search:__ Datasets can be optionally made public, allowing their descriptions and AI-generated tags to fuel a global search. Users can enter search terms and receive a list of datasets ranked by relevance. This feature enables users to discover datasets from others that match their interests, and view the profiles of dataset owners to explore their other public datasets.

## Notice

- Backend server will benefit greatly from a GPU, developement was done on an RTX 3090 with cuda 12.2
- Please allocate enough compute for a smooth experience

## Technologies
- React
- Django
- SQLite
- GroundingDINO
- BLIP

## Setup

To setup the frontend, from the root of the app, run:

```bash
cd frontend
npm install
```
To setup the backend, from the root of the app, run:

```bash
pipenv shell
```

To setup the AI pipeline, from the root of the app, run:

```bash
source environment/setup.sh
```

## Usage

```bash
cd backend
./manage.py runserver
#start redis and celery (ENZO PLS DO THIS)
cd ../frontend
npm start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

__ObjDumpAI__ was developed as a final project for CS 35L taught by Professor Paul Eggert at UCLA in Spring 2024. Made by: Sean Son, Brian Hong, David Wang, Enzo Saracen.