from base_settings.models import User
from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver

from filesystem.exceptions import JsonValidationError
from filesystem.models import Folder, UserStorageInfo, File


@receiver(post_save, sender=User)
def create_filesystem_on_user_creating(instance: User, created: bool, **kwargs):
    if not created:
        return

    root_folder = Folder.objects.create(
        name='root',
        owner=instance
    )

    UserStorageInfo.objects.create(
        root=root_folder,
        user=instance
    )

@receiver(post_save, sender=File)
def update_used_space_on_file_uploading(instance : File, created: bool, **kwargs):
    if not created:
        return

    fs_info = UserStorageInfo.objects.get(user = instance.owner)

    file_length = instance.data.size
    if fs_info.used_space + file_length > fs_info.available_space:
        raise JsonValidationError("file size exceed max available space")

    fs_info.used_space += file_length
    fs_info.save(force_update = True)

@receiver(post_delete, sender=File)
def update_used_space_on_file_deleting(instance : File, **kwargs):
    fs_info = UserStorageInfo.objects.get(user = instance.owner)

    fs_info.used_space -= instance.data.size
    fs_info.save(force_update = True)

