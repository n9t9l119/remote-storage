from rest_framework import viewsets

from fs_play.models import File
from fs_play.serializers import FileSerializer


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    lookup_field = 'name'


