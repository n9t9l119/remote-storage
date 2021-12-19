from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from base_settings.models import User

from filesystem.helpers import get_file_param, get_str_param, get_uuid_param
from filesystem.parsers import CustomFileUploadParser
from filesystem.services import FilesystemService


class GetViewSet(APIView):
    def post(self, request):
        id = get_uuid_param(request, 'id', True)
        user = request.user if isinstance(request.user, User) else None
        return FilesystemService(user).get(id)


class RenameViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        id = get_uuid_param(request, 'id')
        new_name = get_str_param(request, 'new_name')
        user = request.user
        return FilesystemService(user).rename(id, new_name)


class MoveViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        id = get_uuid_param(request, 'id')
        new_parent_id = get_uuid_param(request, 'new_parent_id')
        user = request.user
        return FilesystemService(user).move(id, new_parent_id)


class DeleteViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        id = get_uuid_param(request, 'id')
        user = request.user
        return FilesystemService(user).delete(id)


class CreateFolderViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        parent_id = get_uuid_param(request, 'parent_id')
        name = get_str_param(request, 'name')
        user = request.user
        return FilesystemService(user).create_folder(parent_id, name)


class UploadFileViewSet(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (CustomFileUploadParser, JSONParser)

    def post(self, request):
        parent_id = get_uuid_param(request, 'parent_id')
        file_data = get_file_param(request)
        user = request.user
        return FilesystemService(user).upload_file(file_data, parent_id)


class DownloadFileViewSet(APIView):

    def get(self, request):
        id = get_uuid_param(request, 'id')
        user = request.user if isinstance(request.user, User) else None
        return FilesystemService(user).download_file(id)


class ShareViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = get_uuid_param(request, 'username', True)
        user = request.user
        return FilesystemService(user).share_filesystem(username)


class StopShareViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = get_uuid_param(request, 'username', True)
        user = request.user
        return FilesystemService(user).stop_share_filesystem(username)
