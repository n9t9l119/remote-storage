# Generated by Django 3.2.7 on 2021-12-20 00:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('filesystem', '0006_auto_20211219_2337'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fileusage',
            name='file',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='filesystem.file'),
        ),
    ]
