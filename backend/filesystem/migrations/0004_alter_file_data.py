# Generated by Django 3.2.8 on 2021-12-18 22:04

import django.core.files.storage
from django.db import migrations
import filesystem.fields
import pathlib


class Migration(migrations.Migration):

    dependencies = [
        ('filesystem', '0003_auto_20211212_2023'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='data',
            field=filesystem.fields.UniqueNameFileField(storage=django.core.files.storage.FileSystemStorage(base_url='/storage/', location=pathlib.PureWindowsPath('D:/Daniil/Works/remote-storage/backend/storage')), upload_to='%Y/%m/%d/'),
        ),
    ]