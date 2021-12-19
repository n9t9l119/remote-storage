import os
import uuid
from enum import Enum
from typing import Union

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db import models

from base_settings.models import User

from filesystem.fields import UniqueNameFileField


class Folder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, related_name='parent_folder')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    root = models.ForeignKey('self', on_delete=models.DO_NOTHING, null=True, related_name='root_folder')

    @property
    def type(self):
        return ObjectType.FOLDER

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    'name',
                    'parent',
                    'owner'],
                name='unique_folder')
        ]


class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=False)
    data = UniqueNameFileField(
        storage=FileSystemStorage(
            location=settings.STORAGE_ROOT,
            base_url=settings.STORAGE_URL),
        upload_to='%Y/%m/%d/',
        blank=False)
    parent = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='file_parent_folder')
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    root = models.ForeignKey(Folder, on_delete=models.DO_NOTHING, related_name='file_root_folder')

    @property
    def type(self):
        return ObjectType.FILE

    @property
    def extension(self):
        return os.path.splitext(self.name)[1]

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    'name',
                    'parent',
                    'owner'],
                name='unique_file')
        ]



class UserStorageInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.DO_NOTHING)
    root = models.OneToOneField(Folder, on_delete=models.CASCADE)
    used_space = models.PositiveBigIntegerField(default=0)
    available_space = models.PositiveBigIntegerField(default=1024*1024*1024*5)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    'root',
                    'user'],
                name='unique_root')
        ]

class SharedStorages(models.Model):
    storage = models.ForeignKey(UserStorageInfo, on_delete=models.DO_NOTHING)
    allowed_user = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    'storage',
                    'allowed_user'],
                name='unique_share')
        ]

class FileUsage(models.Model):
    file = models.ForeignKey(File, on_delete=models.DO_NOTHING)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    date = models.DateTimeField(auto_now_add=True)

class ObjectType(Enum):
    FILE = (1, File)
    FOLDER = (2, Folder)

    @property
    def model(self) -> Union[File, Folder]:
        return self.value[1]
