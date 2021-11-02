from django.conf.urls.static import static
from django.urls import path

from filesystem.views import GetViewSet, RenameViewSet, MoveViewSet, DeleteViewSet, CreateFolderViewSet, \
    UploadFileViewSet, DownloadFileViewSet
from remoteStorage import settings

urlpatterns = [
    path('get', GetViewSet.as_view()),
    path('rename', RenameViewSet.as_view()),
    path('move', MoveViewSet.as_view()),
    path('delete', DeleteViewSet.as_view()),
    path('create_folder', CreateFolderViewSet.as_view()),
    path('upload_file', UploadFileViewSet.as_view()),
    path('download_file', DownloadFileViewSet.as_view())
]

if settings.DEBUG:
    urlpatterns += static(settings.STORAGE_URL, document_root=settings.STORAGE_ROOT)
