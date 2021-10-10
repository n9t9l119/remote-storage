from django.db import models

# Create your models here.

class File(models.Model):
    path = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, blank=False)
    file = models.FileField(upload_to='uploads/%Y/%m/%d/', blank=False)
    creation_date = models.DateTimeField(auto_now_add=True)