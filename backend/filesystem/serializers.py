from django.contrib.auth.models import User

from rest_framework import serializers
from filesystem.models import File, Folder

class FolderGetSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    parent_id = serializers.IntegerField(source='parent.id', default=None)
    parent_name = serializers.CharField(source='parent.name', default=None)
    owner_name = serializers.CharField(source='owner.username')
    creation_date = serializers.DateTimeField(format='%d.%m.%Y %H:%M')

class FolderPostSerializer(serializers.Serializer):
    name = serializers.CharField()
    parent_id = serializers.IntegerField(source='parent.id', default=None)
    owner_id = serializers.IntegerField(source='owner.id')

    def create(self, validated_data):
        folder = Folder()
        folder.name = validated_data['name']
        folder.parent = Folder.objects.get(id = validated_data['parent']['id'])
        folder.owner = User.objects.get(id = validated_data['owner']['id'])
        folder.save()
        return folder

class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['name', 'parent', 'creation_date', 'owner']

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['name', 'parent', 'data', 'creation_date', 'owner']
