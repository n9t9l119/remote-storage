import datetime
import time
import uuid

from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser
from rest_framework.views import APIView
from django.contrib.auth.models import User

from filesystem.models import File, Folder
from filesystem.serializers import FileSerializer, FolderGetSerializer, FolderPostSerializer, FolderSerializer, GetSerializer

class FilesystemHelpers:
    def response(self, parent, children):
        objects = []
        for child in children:
            objects.append({
                "type": "folder",
                "id": child.id,
                "name": child.name,
                "creation_date": child.creation_date,
                "owner": child.owner.username
            })

        return Response({"response": {"parent_id": parent.id, "owner": parent.owner.username, "objects": objects} })

    def get_str_param(self, request, name, raise_exc = False):
        param = request.GET.get(name)
        if param is None and raise_exc:
            raise Response({"error": {"text": f"param {name} is not in params"}}, status=404)
        return param

    def get_uuid_param(self, request, name, raise_exc = False):
        param = self.get_str_param(request, name, raise_exc)
        if param is not None:
            return uuid.UUID(param)
        return param

    def get_folder_by_id(self, id, include_root = True):
        if id is not None:
            folder = Folder.objects.filter(id=id)
            if not folder.exists():
                raise Response({"error": {"text": f"folder with id {id} not found"}}, status=404)
            return parent
        if id is None and include_root: #TODO: Костыль, Наташа не бей)))
            parent = Folder()
            parent.owner = User.objects.first()
            parent.name = 'root'
            parent.id = None
            return parent
        raise Response({"error": {"text": "root folder is not supported in this method"}}, status=404)


class GetViewSet(APIView, FilesystemHelpers):
    serializer_class = GetSerializer

    def post(self, request):
        self.serializer_class().validate(request.data)

        id = self.get_uuid_param(request, 'id')
        parent = self.get_folder_by_id(id)
        children = Folder.objects.filter(parent_id = id)

        return self.response(parent, children)

class RenameFolderViewSet(APIView, FilesystemHelpers):
    def get(self, request):
        id = self.get_uuid_param(request, 'id', True)
        new_name = self.get_str_param(request, 'new_name', True)

        folder = self.get_folder_by_id(id, include_root=False)
        folder.name = new_name
        folder.save()

        children = Folder.objects.filter(parent_id = folder.parent_id)
        parent = self.get_folder_by_id(folder.parent_id)

        return self.response(parent, children)

class CreateFolderViewSet(APIView, FilesystemHelpers):
    def get(self, request):
        parent_id = self.get_uuid_param(request, 'parent_id')
        name = self.get_str_param(request, 'name', True)

        parent = self.get_folder_by_id(parent_id)

        folder = Folder()
        folder.name = name
        folder.owner = User.objects.first() #TODO: Определять юзера
        folder.parent = parent if parent.id is not None else None #TODO: Костыль)))
        folder.save()

        children = Folder.objects.filter(parent_id = parent_id)

        return self.response(parent, children)

class FileUploadViewSet(APIView):
    parser_classes = (FileUploadParser,)

    def post(self, request, format='jpg'):
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