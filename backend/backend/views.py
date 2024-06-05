from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import os
from django.http import FileResponse, Http404
from profiles.models import Dataset

class ServeProtectedMedia(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id, dataset_id, filename):
        try:
            dataset = Dataset.objects.get(id=dataset_id, user_id=user_id)
        except Dataset.DoesNotExist:
            return Response({'detail': 'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.id != user_id and not dataset.public:
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        file_path = os.path.join(settings.PROTECTED_MEDIA_ROOT, str(user_id), str(dataset_id), filename)
        if not os.path.exists(file_path):
            raise Http404("File not found")

        return FileResponse(open(file_path, "rb"))
