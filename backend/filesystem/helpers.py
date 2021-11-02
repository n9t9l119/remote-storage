import uuid
from typing import Union, Iterable, Any, Optional

from rest_framework.exceptions import ValidationError, ParseError
from rest_framework.request import Request

from base_settings.models import User
from filesystem.models import Folder, File, ObjectType, FolderRootOwner


def get_str_param(request, name) -> str:
    param = request.query_params.get(name)
    if param is None:
        raise ParseError({"error": {"text": f"Param {name} is not in params"}})
    return param

def get_uuid_param(request : Request, name :str) -> uuid.UUID:
    param = request.query_params.get(name)
    if param is None:
        raise ParseError({"error": {"text": f"Param {name} is not in params"}})
    try:
        return uuid.UUID(param)
    except:
        raise ParseError({"error": {"text": f"Param {name} is not uuid"}})
