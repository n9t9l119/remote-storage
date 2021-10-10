from django.contrib import admin
from django.urls import path, include

from rest_framework import routers

import fs_play.views
from . import views

urlpatterns = [
    path('files/<pk>', fs_play.views.FileViewSet.as_view({'get': 'retrieve', 'post' : 'create'})),
    path('admin/', admin.site.urls),
    path('', views.index),
]
