import os

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from base_settings.models import User
from filesystem.models import Folder, FolderRootOwner, File


@receiver(post_save, sender=User)
def create_filesystem_on_user_creating(instance : User, created : bool, **kwargs):
    if not created:
        return
    root_folder = Folder.objects.create(
        name='root',
        owner=instance
    )
    root_folder.save()

    folder_root_owner = FolderRootOwner.objects.create(
        root=root_folder,
        user=instance
    )
    folder_root_owner.save()
    print("sdjfhsdjfhsdkjfhsjkdf")