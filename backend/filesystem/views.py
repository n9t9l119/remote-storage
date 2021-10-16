import uuid

from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from filesystem.models import File, Folder
from filesystem.serializers import FileSerializer, FolderGetSerializer, FolderPostSerializer


class FolderViewSet(APIView):
    def get(self, request):
        response = {
            "response": {
                "owner": "Rakuk",
                "parent_id": None,
                "objects": [
                    {
                        "type": "folder",
                        "id": uuid.uuid4(),
                        "name": "Моя папка 1",
                        "creation_date": 1634393589,
                        "owner": "Rakuk",
                    },
                    {
                        "type": "folder",
                        "id": uuid.uuid4(),
                        "name": "Моя папка 2",
                        "creation_date": 1634393589,
                        "owner": "Savam",
                    },
                    {
                        "type": "folder",
                        "id": uuid.uuid4(),
                        "name": "Моя папка 3",
                        "creation_date": 1634393589,
                        "owner": "nlonkina._.",
                    },
                ]
            }
        }
        return Response(response)


# class FolderViewSet(viewsets.ModelViewSet):
#     queryset = Folder.objects.all()
#     serializer_class = FolderGetSerializer
#
#     def list(self, request, *args, **kwargs):
#         queryset = Folder.objects.all()
#         page = self.paginate_queryset(queryset)
#         if page is not None:
#             serializer = FolderGetSerializer(page, many=True)
#             return self.get_paginated_response(serializer.data)
#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)
#
#     def create(self, request, *args, **kwargs):
#         serializer = FolderPostSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

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