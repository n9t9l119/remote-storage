import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    refresh_token = models.CharField(max_length=256)
