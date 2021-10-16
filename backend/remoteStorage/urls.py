from django.conf.urls import url
from django.contrib import admin
from django.http.response import HttpResponse
from django.shortcuts import render
from django.urls import path

from . import views
from .views import GetTokens

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth', GetTokens.as_view()),
    url(r'^$', views.index),
    url(r'^(?:.*)\/?$', views.index)
]
