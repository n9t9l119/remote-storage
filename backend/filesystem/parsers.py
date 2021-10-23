from rest_framework.parsers import FileUploadParser
from filesystem.helpers import get_str_param

class CustomFileUploadParser(FileUploadParser):
    def get_filename(self, stream, media_type, parser_context):
        request = parser_context['request']

        filename = get_str_param(request, 'filename')
        return filename
