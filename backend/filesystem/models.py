from django.contrib.auth.models import User
from django.db import models
import uuid
import os

from enum import Enum

class Type(Enum):
    FILE = 1,
    FOLDER = 2

class Folder(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)

    @property
    def type(self):
        return Type.FOLDER

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'parent', 'owner'], name='unique_folder')
        ]

class UniqueNameFileField(models.FileField):
     def generate_filename(self, instance, filename):
         _, ext = os.path.splitext(filename)
         name = f'{uuid.uuid4().hex}{ext}'
         return super().generate_filename(instance, name)

class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=False)
    data = UniqueNameFileField(upload_to='%Y/%m/%d/', blank=False)
    parent = models.ForeignKey(Folder, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)

    @property
    def type(self):
        return Type.FOLDER

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'parent', 'owner'], name='unique_file')
        ]