from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.http.response import HttpResponse
from django.shortcuts import render
from django.urls import path

from rest_framework import routers

import filesystem.views
from . import views, settings

urlpatterns = [
    path('files/', filesystem.views.FileViewSet.as_view({'get': 'list', 'post' : 'create'})),
    path('folders/', filesystem.views.FolderViewSet.as_view()),
    path('admin/', admin.site.urls),
    url(r'^$', views.index),
    url(r'^(?:.*)\/?$', views.index)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)