import datetime
import time
import uuid

from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from filesystem.models import File, Folder
from filesystem.serializers import FileSerializer, FolderGetSerializer, FolderPostSerializer

tree = {
    "children": [
        {
            "name": "Папка 1",
            "id": uuid.uuid4(),
            "children": [
                {
                    "name": "Папка 2",
                    "id": uuid.uuid4(),
                    "children": []
                },
                {
                    "name": "Папка 3",
                    "id": uuid.uuid4(),
                    "children": [
                        {
                            "name": "Папка 4",
                            "id": uuid.uuid4(),
                            "children": []
                        }
                    ]
                },
            ]
        }
    ]
}


def findFolder(parent_tree, parent_id):
    if parent_id is None:
        return parent_tree

    for child in parent_tree['children']:
        if child['id'] == parent_id:
            return child
        res = findFolder(child, parent_id)
        if res is not None:
            return res
    return None

def convert(res, id):
    objects = []
    for object in res['children']:
        objects.append({
            "type": "folder",
            "id": object["id"],
            "name": object["name"],
            "creation_date": int(time.mktime(datetime.datetime.utcnow().timetuple())),
            "owner": "Rakuk"
        })

    return {"parent_id": id, "owner" : "Rakuk", "objects" : objects }

class FilesystemGetViewSet(APIView):
    def get(self, request):
        if 'id' in request.GET:
            id = uuid.UUID(request.GET['id'])
        else:
            id = None

        res = findFolder(tree, id)

        if res is None:
            return Response({"error": { "text" : "folder with id not found"}}, status=404)

        return Response({"response": convert(res, id)})


class FilesystemRenameFolderViewSet(APIView):
    def get(self, request):
        if not 'id' in request.GET:
            return Response({"error": { "text" : "'id' not in request"}}, status=404)

        if not 'new_name' in request.GET:
            return Response({"error": { "text" : "'new_name' not in request"}}, status=404)

        id = uuid.UUID(request.GET['id'])
        new_name = request.GET['new_name']

        if not 'from_result' in request.GET:
            from_result = id
        elif not (request.GET['from_result'] == '' or request.GET['from_result'] == 'null'):
            from_result = uuid.UUID(request.GET['from_result'])
        else:
            from_result = None


        res = findFolder(tree, id)
        if res is None:
            return Response({"error": { "text" : "folder with id not found"}}, status=404)
        res['name'] = new_name

        res = findFolder(tree, from_result)
        if res is None:
            return Response({"error": { "text" : "folder with from_result not found"}}, status=404)

        return Response({"response": convert(res, from_result)})

class FilesystemCreateFolderViewSet(APIView):
    def get(self, request):
        if not 'parent_id' in request.GET:
            return Response({"error": { "text" : "'parent_id' not in request"}}, status=404)

        if not 'name' in request.GET:
            return Response({"error": { "text" : "'name' not in request"}}, status=404)

        name = request.GET['name']

        if not (request.GET['parent_id'] == '' or request.GET['parent_id'] == 'null'):
            id = uuid.UUID(request.GET['parent_id'])
        else:
            id = None

        res = findFolder(tree, id)
        if res is None:
            return Response({"error": { "text" : "folder with id not found"}}, status=404)
        res['children'].append({
            "name": name,
            "id": uuid.uuid4(),
            "children": []
        })

        return Response({"response": convert(res, id)})

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