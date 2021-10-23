from django.urls import path

from filesystem.views import FolderViewSet, GetViewSet, RenameViewSet, MoveViewSet, DeleteViewSet, CreateFolderViewSet, \
    UploadFileViewSet

urlpatterns = [
    path('folders', FolderViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('get', GetViewSet.as_view()),
    path('rename', RenameViewSet.as_view()),
    path('move', MoveViewSet.as_view()),
    path('delete', DeleteViewSet.as_view()),
    path('create_folder', CreateFolderViewSet.as_view()),
    path('upload_file', UploadFileViewSet.as_view()),
]
