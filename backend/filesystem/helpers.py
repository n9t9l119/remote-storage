import uuid
from typing import Union, Iterable, Any

from rest_framework.exceptions import ValidationError, ParseError
from rest_framework.request import Request

from filesystem.models import Folder, File, ObjectType


def get_str_param(request, name):
    param = request.query_params.get(name)
    if param is None:
        raise ParseError({"error": {"text": f"param {name} is not in params"}})
    return param

def get_uuid_param(request : Request, name :str, raise_exc : bool = True):
    param = request.query_params.get(name)
    if param is None and not raise_exc:
        return None  # TODO: Временно
    elif param is None:
        raise ParseError({"error": {"text": f"param {name} is not in params"}})
    try:
        return uuid.UUID(param)
    except:
        raise ParseError({"error": {"text": f"param {name} is not uuid"}})


def merge_into_iterable(*args : Union[Iterable, Any]):
    for arg in args:
        if hasattr(arg, '__iter__'):
            for item in arg:
                yield item
            continue
        yield arg


def get_folder_by_id(id : uuid.UUID) -> Folder:
    folder = Folder.objects.filter(id=id)
    if not folder.exists():
        raise ValidationError({"error": {"text": f"folder with id '{id}' not found"}})
    return folder.first()

def get_file_by_id(id : uuid.UUID) -> File:
    file = File.objects.filter(id=id)
    if not file.exists():
        raise ValidationError({"error": {"text": f"file with id '{id}' not found"}})
    return file.first()

def get_object_by_id(id : uuid.UUID) -> Union[Folder, File]:
    for objType in ObjectType:
        obj = objType.model.objects.filter(id=id)
        if obj.exists():
            return obj.first()
    raise ValidationError({"error": {"text": f"folder or file with id '{id}' not found"}})


def get_children(parent_id : uuid.UUID):
    for objType in ObjectType:
        for obj in objType.model.objects.filter(parent_id = parent_id):
            yield obj
