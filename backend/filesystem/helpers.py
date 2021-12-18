import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.core.files import File
from rest_framework.request import Request

from base_settings.models import User
from filesystem.exceptions import JsonParseError


def get_str_param(request: Request, name: str) -> str:
    param = request.query_params.get(name)
    if param is None:
        raise JsonParseError(f"Param {name} is not in params")
    return param


def get_uuid_param(request: Request, name: str, can_be_none=False) -> uuid.UUID:
    param = request.query_params.get(name)
    if param is None:
        if can_be_none:
            return None
        raise JsonParseError(f"Param '{name}' is not in params")
    try:
        return uuid.UUID(param)
    except BaseException:
        raise JsonParseError(f"Param '{name}' is not uuid")


def get_file_param(request: Request) -> File:
    file = request.FILES.get('file')
    if file is None:
        raise JsonParseError(f"There is no file data in body")
    return file

def assert_is_registered_user(user : AbstractBaseUser):
    if user is None or not isinstance(user, User):
        raise JsonParseError("Cannot identify user for this operation")