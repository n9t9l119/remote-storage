from rest_framework import serializers
from fs_play.models import File


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['path', 'name', 'file', 'creation_date']
