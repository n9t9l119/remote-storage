import uuid
from typing import Iterable, Union

from filesystem.models import File, Folder
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from rest_framework.response import Response

class FilesystemService:
    def get(self, id : uuid.UUID, user : User):
        folder = self.__get_folder_by_id(id)
        children = Folder.objects.filter(parent_id=id)
        return self.response(folder, children)

    def createFolder(self, parent_id : uuid.UUID, name : str, user : User):
        parent = self.__get_folder_by_id(parent_id)
        folder = Folder()
        folder.name = name
        folder.owner = user
        folder.parent = parent
        folder.save()
        children = Folder.objects.filter(parent_id=parent_id)
        return self.response(parent, children)

    def delete(self, id : uuid.UUID, user : User):
        folder = self.__get_folder_by_id(id, include_root=False)
        parent_id = folder.parent_id
        folder.delete()

        children = Folder.objects.filter(parent_id=parent_id)
        parent = self.__get_folder_by_id(parent_id)

        return self.response(parent, children)

    def rename(self, id: uuid.UUID, new_name : str, user : User):
        folder = self.__get_folder_by_id(id, include_root=False)
        folder.name = new_name
        folder.save()

        children = Folder.objects.filter(parent_id=folder.parent_id)
        parent = self.__get_folder_by_id(folder.parent_id)
        return self.response(parent, children)

    def move(self, id: uuid.UUID, new_parent_id : uuid.UUID, user : User):
        folder = self.__get_folder_by_id(id, include_root=False)
        old_parent = folder.parent
        folder.parent = self.__get_folder_by_id(new_parent_id, include_root=True)
        folder.save()

        children = Folder.objects.filter(parent_id=folder.parent_id)
        return self.response(old_parent, children)


    @staticmethod
    def __get_folder_by_id(id : uuid, include_root : bool = True) -> Folder:
        folder = Folder.objects.filter(id=id)
        if not folder.exists():
            raise ValidationError({"error": {"text": f"folder with id '{id}' not found"}})
        folder = folder.first()
        if folder.parent is None and not include_root:
            raise ValidationError({"error": {"text": "root folder is not supported in this method"}})
        return folder

    @staticmethod
    def response(parent : Folder, children : Iterable[Union[Folder, File]]):
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

