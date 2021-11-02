import os
from typing import Union

from django.core.files.storage import FileSystemStorage

from base_settings.models import User
from django.db import models
from django.conf import settings

import uuid

from enum import Enum

from filesystem.fields import UniqueNameFileField

class Folder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)

    @property
    def type(self):
        return ObjectType.FOLDER

    def delete(self, using=None, keep_parents=False):
        super().delete(using, keep_parents)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'parent', 'owner'], name='unique_folder')
        ]

class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=False)
    data = UniqueNameFileField(storage=FileSystemStorage(location=settings.STORAGE_ROOT, base_url=settings.STORAGE_URL),
                               upload_to='%Y/%m/%d/', blank=False)
    parent = models.ForeignKey(Folder, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)

    @property
    def type(self):
        return ObjectType.FILE

    @property
    def extension(self):
        return os.path.splitext(self.name)[1]

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'parent', 'owner'], name='unique_file')
        ]

class FolderRootOwner(models.Model):
    root = models.ForeignKey(Folder, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'folder_root_owner'
        constraints = [
            models.UniqueConstraint(fields=['root', 'user'], name='unique_root')
        ]

class ObjectType(Enum):
    FILE = (1, File)
    FOLDER = (2, Folder)

    @property
    def model(self) -> Union[File, Folder]:
        return self.value[1]