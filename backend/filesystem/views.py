import datetime
import time
import uuid

from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User

from filesystem.models import File, Folder
from filesystem.serializers import FolderSerializer

from filesystem.services import FilesystemService

import datetime

class FilesystemHelpers:
    def get_str_param(self, request, name):
        param = request.query_params.get(name)
        if param is None:
            raise ValidationError({"error": {"text": f"param {name} is not in params"}})
        return param

    def get_uuid_param(self, request, name):
        param = request.query_params.get(name)
        if param is None:
            return uuid.UUID('af4b90139d0e4cad984ceb16a8734478')  # TODO: Временно
            # raise ValidationError({"error": {"text": f"param {name} is not in params"}})
        try:
            return uuid.UUID(param)
        except:
            raise ValidationError({"error": {"text": f"param {name} is not uuid"}})

class GetViewSet(APIView, FilesystemHelpers):
    def post(self, request):
        id = self.get_uuid_param(request, 'id')
        user = User.objects.first()
        return FilesystemService().get(id, user)


class RenameViewSet(APIView, FilesystemHelpers):
    def post(self, request):
        id = self.get_uuid_param(request, 'id')
        new_name = self.get_str_param(request, 'new_name')
        user = User.objects.first()
        return FilesystemService().rename(id, new_name, user)


class MoveViewSet(APIView, FilesystemHelpers):
    def post(self, request):
        id = self.get_uuid_param(request, 'id')
        new_parent_id = self.get_uuid_param(request, 'new_parent_id')
        user = User.objects.first()
        return FilesystemService().move(id, new_parent_id, user)


class DeleteViewSet(APIView, FilesystemHelpers):
    def post(self, request):
        id = self.get_uuid_param(request, 'id')
        user = User.objects.first()
        return FilesystemService().delete(id, user)

class CreateFolderViewSet(APIView, FilesystemHelpers):
    def post(self, request):
        parent_id = self.get_uuid_param(request, 'parent_id')
        name = self.get_str_param(request, 'name')
        user = User.objects.first()
        return FilesystemService().createFolder(parent_id, name, user)

class UploadFileViewSet(APIView):
    parser_classes = (FileUploadParser,)

    def post(self, request):
        up_file = request.FILES['file']

        file = File()
        file.data = up_file
        file.name = up_file.name
        file.parent = Folder.objects.first()
        file.owner = User.objects.first()
        file.save()

        return Response(up_file.name, status.HTTP_201_CREATED)

class FolderViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FolderSerializer

    # def list(self, request, *args, **kwargs):
    #     # Note the use of `get_queryset()` instead of `self.queryset`
    #     queryset = self.get_queryset()
    #     serializer = FileSerializer(queryset, many=True)
    #     return Response(serializer.data)
    #
    # def retrieve(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance)
    #     return Response(serializer.data)
