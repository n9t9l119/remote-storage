import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models, transaction


class User(AbstractUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    refresh_token = models.CharField(max_length=256)

    @transaction.atomic
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    @transaction.atomic
    def delete(self, using=None, keep_parents=False):
        super().delete(using, keep_parents)