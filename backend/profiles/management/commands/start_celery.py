import os
import multiprocessing
from django.core.management.base import BaseCommand

def start_worker():
    os.system("celery -A backend worker --loglevel=info --pool=threads")

def start_beat():
    os.system("celery -A backend beat --loglevel=info")

class Command(BaseCommand):
    help = "Start Celery worker and beat"

    def handle(self, *args, **kwargs):
        start_worker()
        start_beat()
