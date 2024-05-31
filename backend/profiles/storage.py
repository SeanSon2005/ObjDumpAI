from django.conf import settings
from django.core.files.storage import FileSystemStorage

class ProtectedMediaStorage(FileSystemStorage):
    def __init__(self, *args, **kwargs):
        kwargs['location'] = settings.PROTECTED_MEDIA_ROOT
        super().__init__(*args, **kwargs)
