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
        user = User.objects.first()  # TODO: Получать юзера в запросе
        return FilesystemService().get(id, user)


class RenameViewSet(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        id = get_uuid_param(request, 'id')
        new_name = get_str_param(request, 'new_name')
        user = User.objects.first()
        return FilesystemService().rename(id, new_name, user)


class MoveViewSet(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        id = get_uuid_param(request, 'id')
        new_parent_id = get_uuid_param(request, 'new_parent_id')
        user = User.objects.first()
        return FilesystemService().move(id, new_parent_id, user)


class DeleteViewSet(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        id = get_uuid_param(request, 'id')
        user = User.objects.first()
        return FilesystemService().delete(id, user)


class CreateFolderViewSet(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        parent_id = get_uuid_param(request, 'parent_id')
        name = get_str_param(request, 'name')
        user = User.objects.first()
        return FilesystemService().create_folder(parent_id, name, user)


class UploadFileViewSet(APIView):
    # permission_classes = [IsAuthenticated]
    parser_classes = (CustomFileUploadParser, JSONParser)

    def post(self, request):
        parent_id = get_uuid_param(request, 'parent_id')
        file_data = get_file_param(request)
        user = User.objects.first()
        return FilesystemService().upload_file(file_data, parent_id, user)


class DownloadFileViewSet(APIView):
    def get(self, request):
        id = get_uuid_param(request, 'id')
        user = request.User
        return FilesystemService().download_file(id, user)
