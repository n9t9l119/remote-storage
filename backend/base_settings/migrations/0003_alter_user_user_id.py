# Generated by Django 3.2.7 on 2021-10-16 18:22

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('base_settings', '0002_alter_user_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_id',
            field=models.UUIDField(default=uuid.UUID('03cc78db-e0d5-4aba-a534-bc7d35957550'), editable=False, primary_key=True, serialize=False),
        ),
    ]
