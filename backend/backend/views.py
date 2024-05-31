from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import os
from django.http import FileResponse, Http404

class ServeProtectedMedia(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id, dataset_id, filename):
        if request.user.id != user_id:
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        file_path = os.path.join(settings.PROTECTED_MEDIA_ROOT, f"{user_id}", f"{dataset_id}", filename)
        if not os.path.exists(file_path):
            raise Http404("File not found")
        return FileResponse(open(file_path, "rb"))
