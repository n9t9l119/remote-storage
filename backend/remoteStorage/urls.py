from django.contrib import admin
from django.urls import path

from fs_play.views import FileViewSet
from . import views

urlpatterns = [
    path('files/<name>', FileViewSet.as_view({'get': 'retrieve', 'post': 'create'})),
    path('admin/', admin.site.urls),
    path('', views.index),
]
