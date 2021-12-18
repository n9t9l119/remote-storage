import uuid
from typing import Iterable, Union, Optional
from urllib.parse import quote

from django.contrib.auth.base_user import AbstractBaseUser
from django.db import transaction
from django.db.models.fields import files
from django.http import HttpResponse
from rest_framework.response import Response

from base_settings.models import User
from filesystem.exceptions import JsonValidationError
from filesystem.models import File, Folder, UserStorageInfo, ObjectType, SharedFilesystems


class FilesystemService:
    def get(self, id: uuid.UUID, user: AbstractBaseUser) -> Response:
        if id is None:
            folder = UserStorageInfo.objects.get(user=user).root
        else:
            folder = self._get_folder_by_id(id)

        self._assert_have_access(user, folder)

        return self._response(folder)

    @transaction.atomic
    def create_folder(self, parent_id: uuid.UUID, name: str, user: User) -> Response:
        self._assert_not_contains_name(parent_id, name)

        fs_info = UserStorageInfo.objects.get(user=user)
        parent = self._get_folder_by_id(parent_id)

        self. _assert_have_access(user, parent)

        Folder.objects.create(
            name=name,
            owner=user,
            parent=parent,
            root=fs_info.root
        )

        return self._response(parent)

    @transaction.atomic
    def delete(self, id: uuid.UUID, user: User) -> Response:
        self._assert_not_root_folder(id, "delete")

        fs_obj = self._get_fs_object_by_id(id)

        self._assert_have_access(user, fs_obj)

        parent = fs_obj.parent
        fs_obj.delete()

        return self._response(parent)

    @transaction.atomic
    def rename(self, id: uuid.UUID, new_name: str, user: User) -> Response:
        self._assert_not_root_folder(id, "rename")

        fs_obj = self._get_fs_object_by_id(id)

        self._assert_have_access(user, fs_obj)
        self._assert_not_contains_name(fs_obj.parent_id, new_name)

        fs_obj.name = new_name
        fs_obj.save()

        parent = self._get_folder_by_id(fs_obj.parent_id)
        return self._response(parent)

    @transaction.atomic
    def move(self, id: uuid.UUID, new_parent_id: uuid.UUID, user: User) -> Response:
        self._assert_not_root_folder(id, "move")

        fs_obj = self._get_fs_object_by_id(id)

        self._assert_have_access(user, fs_obj)
        self._assert_not_contains_name(new_parent_id, fs_obj.name)

        old_parent = fs_obj.parent
        fs_obj.parent = self._get_folder_by_id(new_parent_id)
        fs_obj.save()

        return self._response(old_parent)

    @transaction.atomic
    def upload_file(self, file_data: files.File, parent_id: uuid.UUID, user: User) -> Response:
        self._assert_not_contains_name(parent_id, file_data.name)

        parent = self._get_folder_by_id(parent_id)
        self._assert_have_access(user, parent)

        fs_info = UserStorageInfo.objects.get(user=user)

        File.objects.create(
            data=file_data,
            name=file_data.name,
            parent=parent,
            root=fs_info.root,
            owner=user
        )

        return self._response(parent)

    def download_file(self, id: uuid.UUID, user: AbstractBaseUser) -> Response:
        file = self._get_file_by_id(id)

        self._assert_have_access(user, file)

        headers = {
            'Content-Type': "application/liquid",
            'Content-Disposition': "attachment; filename*=utf-8''{}".format(quote(file.name))
        }
        return HttpResponse(file.data, headers=headers)

    @transaction.atomic
    def share_filesystem(self, guest_name : Optional[str], owner : User):
        fs_info = UserStorageInfo.objects.get(user=owner)
        guest = FilesystemService._get_user_by_name(guest_name)

        SharedFilesystems.objects.create(
            shared_root = fs_info.root,
            allowed_user = guest
        )

        return Response(status=200)

    @transaction.atomic
    def stop_share_filesystem(self, guest_name : str, owner : User):
        fs_info = UserStorageInfo.objects.get(user=owner)
        guest = FilesystemService._get_user_by_name(guest_name)

        results = SharedFilesystems.objects.filter(
            shared_root = fs_info.root,
            allowed_user = guest
        )

        if not results:
            raise JsonValidationError(f"No shared filesystems to user '{guest_name}'")

        results.delete()
        return Response(status=200)

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

        return Response({
            "id": parent.id,
            "name": parent.name if parent.parent_id is not None else None,
            "parent_id": parent.parent_id,
            "owner_name": parent.owner.username,
            "owner_id": parent.owner.user_id,
            "objects": objects
        }, status=200)

    @staticmethod
    def _assert_have_access(user : Union[AbstractBaseUser, User], fs_obj : Union[File, Folder]):
        root = fs_obj.root if fs_obj.root is not None else fs_obj

        is_registered_user = isinstance(user, User)
        if is_registered_user:
            fs_info = UserStorageInfo.objects.get(user = user)
            if fs_info.root == root:
                return

        if not SharedFilesystems.objects.filter(shared_root = root, allowed_user = user if is_registered_user else None).exists():
            raise JsonValidationError(f"You have not access to file or folder '{fs_obj.name}'")

    @staticmethod
    def _get_user_by_name(username : str):
        if username is None:
            return None

        results = User.objects.filter(username = username)
        if results:
            return results.first()
        raise JsonValidationError(f"User with username '{username}' does not exists")

    @staticmethod
    def _assert_not_contains_name(parent_id: uuid.UUID, name: str):
        for fs_obj in FilesystemService._get_children(parent_id):
            if fs_obj.name == name:
                raise JsonValidationError(f"Folder or file with name '{name}' already exists")

    @staticmethod
    def _assert_not_root_folder(id: uuid.UUID, action_name: str):
        if UserStorageInfo.objects.filter(root_id=id).exists():
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
