from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('api/v1/', include('base_settings.urls')),
    path('admin/', admin.site.urls),
    url(r'^$', views.index),
    url(r'^(?:.*)\/?$', views.index)
]
