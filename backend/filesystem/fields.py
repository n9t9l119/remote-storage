import os
import uuid

from django.db import models
from django.conf import settings


class UniqueNameFileField(models.FileField):
    def generate_filename(self, instance, filename):
        _, ext = os.path.splitext(filename)
        name = f'{uuid.uuid4().hex}'
        if settings.DEBUG:
            name = f'{name}{ext}'
        return super().generate_filename(instance, name)
