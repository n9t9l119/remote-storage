from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from . import views, settings

urlpatterns = [
    path('api/v1/', include('base_settings.urls')),
    path('api/v1/filesystem/', include('filesystem.urls')),
    path('admin/', admin.site.urls),
    url(r'^$', views.index),
    url(r'^(?:.*)\/?$', views.index)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
