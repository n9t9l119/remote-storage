import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

import filesystem


class User(AbstractUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    refresh_token = models.CharField(max_length=256)
    root_folder = models.ForeignKey('filesystem.Folder', on_delete=models.CASCADE, db_constraint=False)

    def save(self, *args, **kwargs):
        self.root_folder_id = uuid.uuid4()
        super().save(*args, **kwargs)

        # TODO: Циклическая зависимость походу не ок
        root_folder = filesystem.models.Folder.objects.create(
            id = self.root_folder_id,
            name='root',
            owner_id = self.user_id)
        root_folder.save()