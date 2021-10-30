from django.urls import path

from base_settings.views import RegisterView, LogIn, RefreshToken, TestAuth

urlpatterns = [
    path('login/',  LogIn.as_view()),
    path('refresh/',  RefreshToken.as_view()),
    path('register/', RegisterView.as_view()),
    path('testauth/', TestAuth.as_view()),
]
