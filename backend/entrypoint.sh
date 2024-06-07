#!/bin/sh

python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000 &
celery -A backend worker --pool=threads --loglevel=info &
celery -A backend beat --loglevel=info
