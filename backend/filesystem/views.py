import datetime
import time
import uuid
from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from filesystem.parsers import CustomFileUploadParser
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from base_settings.models import User
from filesystem.models import File, Folder
from filesystem.services import FilesystemService
from filesystem.helpers import get_uuid_param, get_str_param
import datetime

class GetViewSet(APIView):
    def post(self, request):
        id = get_uuid_param(request, 'id')
        user = User.objects.first() #TODO: Получать юзера в запросе
        return FilesystemService().get(id, user)


class RenameViewSet(APIView):
    def post(self, request):
        id = get_uuid_param(request, 'id')
        new_name = get_str_param(request, 'new_name')
        user = User.objects.first()
        return FilesystemService().rename(id, new_name, user)


class MoveViewSet(APIView):
    def post(self, request):
        id = get_uuid_param(request, 'id')
        new_parent_id = get_uuid_param(request, 'new_parent_id')
        user = User.objects.first()
        return FilesystemService().move(id, new_parent_id, user)


class DeleteViewSet(APIView):
    def post(self, request):
        id = get_uuid_param(request, 'id')
        user = User.objects.first()
        return FilesystemService().delete(id, user)


class CreateFolderViewSet(APIView):
    def post(self, request):
        parent_id = get_uuid_param(request, 'parent_id')
        name = get_str_param(request, 'name')
        user = User.objects.first()
        return FilesystemService().create_folder(parent_id, name, user)


class UploadFileViewSet(APIView):
    parser_classes = (CustomFileUploadParser,)

    def post(self, request):
        parent_id = get_uuid_param(request, 'parent_id')
        file_data = request.FILES['file']
        user = User.objects.first()
        return FilesystemService().upload_file(file_data, parent_id, user)

class DownloadFileViewSet(APIView):
    def get(self, request):
        id = get_uuid_param(request, 'id')
        user = User.objects.first()
        return FilesystemService().download_file(id, user)  # get(id, user)