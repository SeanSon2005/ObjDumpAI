from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings
import multiprocessing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

app = Celery("backend")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")

if __name__ == "__main__":
    multiprocessing.set_start_method("spawn")
