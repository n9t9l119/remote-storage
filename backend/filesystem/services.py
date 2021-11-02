import uuid
from typing import Iterable, Union
from urllib.parse import quote

from django.db import transaction
from django.db.models.fields import files
from django.http import HttpResponse
from rest_framework.response import Response

from base_settings.models import User

from filesystem.exceptions import JsonValidationError
from filesystem.models import File, Folder, FolderRootOwner, ObjectType


class FilesystemService:
    def get(self, id: uuid.UUID, user: User) -> Response:
        folder = self._get_folder_by_id(id)
        return self._response(folder)

    @transaction.atomic
    def create_folder(self, parent_id: uuid.UUID, name: str,
                      user: User) -> Response:
        self._assert_not_contains_name(parent_id, name)

        parent = self._get_folder_by_id(parent_id)

        Folder.objects.create(
            name=name,
            owner=user,
            parent=parent
        ).save()

        return self._response(parent)

    @transaction.atomic
    def delete(self, id: uuid.UUID, user: User) -> Response:
        self._assert_not_root_folder(id, "delete")

        fs_obj = self._get_fs_object_by_id(id)
        parent = fs_obj.parent
        fs_obj.delete()

        return self._response(parent)

    @transaction.atomic
    def rename(self, id: uuid.UUID, new_name: str, user: User) -> Response:
        self._assert_not_root_folder(id, "rename")

        fs_obj = self._get_fs_object_by_id(id)

        self._assert_not_contains_name(fs_obj.parent_id, new_name)

        fs_obj.name = new_name
        fs_obj.save()

        parent = self._get_folder_by_id(fs_obj.parent_id)
        return self._response(parent)

    @transaction.atomic
    def move(self, id: uuid.UUID, new_parent_id: uuid.UUID, user: User) -> Response:
        self._assert_not_root_folder(id, "move")

        fs_obj = self._get_fs_object_by_id(id)

        self._assert_not_contains_name(new_parent_id, fs_obj.name)

        old_parent = fs_obj.parent
        fs_obj.parent = self._get_folder_by_id(new_parent_id)
        fs_obj.save()

        return self._response(old_parent)

    @transaction.atomic
    def upload_file(self, file_data: files.File, parent_id: uuid.UUID, user: User) -> Response:
        self._assert_not_contains_name(parent_id, file_data.name)

        parent = self._get_folder_by_id(parent_id)

        file = File.objects.create(
            data=file_data,
            name=file_data.name,
            parent=parent,
            owner=user
        )
        file.save()

        return self._response(parent)

    def download_file(self, id: uuid.UUID, user: User) -> Response:
        file = self._get_file_by_id(id)
        headers = {
            'Content-Type': "application/liquid",
            'Content-Disposition': "attachment; filename*=utf-8''{}".format(quote(file.name))
        }
        return HttpResponse(file.data, headers=headers)

    @staticmethod
    def _response(parent: Folder) -> Response:
        children = FilesystemService._get_children(parent.id)
        objects = []
        for child in sorted(children, key=lambda fs_obj: fs_obj.name):
            info = {
                "type": child.type.name.lower(),
                "id": child.id,
                "owner_name": child.owner.username,
                "owner_id": child.owner.user_id,
                "name": child.name,
                "creation_date": child.creation_date.timestamp(),
            }
            if isinstance(child, File):
                info["extension"] = child.extension
            objects.append(info)

        return Response({"response": {
            "id": parent.id,
            "parent_id": parent.parent_id,
            "owner": parent.owner.username,
            "objects": objects
        }})

    @staticmethod
    def _assert_not_contains_name(parent_id: uuid.UUID, name: str):
        for fs_obj in FilesystemService._get_children(parent_id):
            if fs_obj.name == name:
                raise JsonValidationError(f"Folder or file with name '{name}' already exists")

    @staticmethod
    def _assert_not_root_folder(id: uuid.UUID, action_name: str):
        if FolderRootOwner.objects.filter(root_id=id).exists():
            raise JsonValidationError(f"You can't {action_name} root folder")

    @staticmethod
    def _get_folder_by_id(id: uuid.UUID) -> Folder:
        folder = Folder.objects.filter(id=id)
        if not folder:
            raise JsonValidationError(f"Folder with id '{id}' not found")
        return folder.first()

    @staticmethod
    def _get_file_by_id(id: uuid.UUID) -> File:
        file = File.objects.filter(id=id)
        if not file:
            raise JsonValidationError(f"File with id '{id}' not found")
        return file.first()

    @staticmethod
    def _get_fs_object_by_id(id: uuid.UUID) -> Union[Folder, File]:
        for objType in ObjectType:
            obj = objType.model.objects.filter(id=id)
            if obj:
                return obj.first()
        raise JsonValidationError(f"Folder or file with id '{id}' not found")

    @staticmethod
    def _get_children(parent_id: uuid.UUID) -> Iterable[Union[Folder, File]]:
        for objType in ObjectType:
            for obj in objType.model.objects.filter(parent_id=parent_id):
                yield obj
