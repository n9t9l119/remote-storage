import uuid
from typing import Iterable, Union

from django.db.models.fields import files
from django.http import HttpResponse

from filesystem.helpers import get_folder_by_id, get_file_by_id, get_object_by_id, get_children, merge_into_iterable
from filesystem.models import File, Folder
from rest_framework.exceptions import ValidationError
from base_settings.models import User
from rest_framework.response import Response
from urllib.parse import quote


class FilesystemService:
    def get(self, id : uuid.UUID, user : User):
        folder = get_folder_by_id(id)
        children = get_children(parent_id=id)
        return self.__response(folder, children)

    def createFolder(self, parent_id : uuid.UUID, name : str, user : User):
        parent = get_folder_by_id(parent_id)

        child_folders = Folder.objects.filter(parent_id=parent_id)
        same_folder = child_folders.filter(name = name)
        if same_folder.exists():
            raise ValidationError({"error": {"text": f"folder with name {name} already exists"}})

        folder = Folder()
        folder.name = name
        folder.owner = user
        folder.parent = parent
        folder.save()

        child_files = File.objects.filter(parent_id = parent_id)
        children = merge_into_iterable(child_folders, folder, child_files)
        return self.__response(parent, children)

    def delete(self, id : uuid.UUID, user : User):
        if id == user.root_folder_id:
            raise ValidationError({"error": {"text": "you cannot delete root folder"}})

        object = get_object_by_id(id)
        parent_id = object.parent_id
        object.delete()

        children = get_children(parent_id=parent_id)
        parent = get_folder_by_id(parent_id)
        return self.__response(parent, children)

    def rename(self, id: uuid.UUID, new_name : str, user : User):
        if id == user.root_folder_id:
            raise ValidationError({"error": {"text": "you cannot rename root folder"}})

        object = get_object_by_id(id)
        object.name = new_name
        object.save()

        children = get_children(parent_id=object.parent_id)
        parent = get_folder_by_id(object.parent_id)
        return self.__response(parent, children)

    def move(self, id: uuid.UUID, new_parent_id : uuid.UUID, user : User):
        if id == user.root_folder_id:
            raise ValidationError({"error": {"text": "you cannot move root folder"}})

        object = get_object_by_id(id)
        old_parent = object.parent
        object.parent = get_folder_by_id(new_parent_id)
        object.save()

        children = get_children(parent_id=object.parent_id)
        return self.__response(old_parent, children)

    def upload_file(self, file_data : files.File, parent_id : uuid.UUID, user : User):
        parent = get_folder_by_id(parent_id)
        child_files = File.objects.filter(parent_id = parent_id)

        same_file = child_files.filter(name = file_data.name)
        if same_file.exists():
            raise ValidationError({"error": {"text": f"file with name {file_data.name} already exists"}})

        file = File()
        file.data = file_data
        file.name = file_data.name
        file.parent = parent
        file.owner = user
        file.save()

        child_folders = Folder.objects.filter(parent_id = parent_id)
        children = merge_into_iterable(child_folders, file, child_files)
        return self.__response(parent, children)

    def download_file(self, id : uuid.UUID, user : User):
        file = get_file_by_id(id)
        headers = {
            # 'Content-Type': "application/liquid",
            'Content-Disposition': "attachment; filename*=utf-8''{}".format(quote(file.name))
        }
        return HttpResponse(file.data, headers=headers)

    @staticmethod
    def __response(parent : Folder, children : Iterable[Union[Folder, File]]):
        objects = []
        for child in children:
            objects.append({
                "type": child.type.name.lower(),
                "id": child.id,
                "name": child.name,
                "creation_date": child.creation_date.timestamp(),
                "owner": child.owner.username
            })
        return Response({"response": {"parent_id": parent.id, "owner": parent.owner.username, "objects": objects}})

