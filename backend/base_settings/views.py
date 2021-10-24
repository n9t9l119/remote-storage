from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from base_settings.serializers import RegisterSerializer, LoginSerializer, RefreshTokenSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

from remoteStorage.rest_api.jwt.generate_jwt import GenerateJwt
from base_settings.models import User


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        self.create(request, *args, **kwargs)
        return Response(GenerateJwt().obtain_jwt(request.data['username']))


class LogIn(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        self.serializer_class().validate(request.data)

        return Response(GenerateJwt().obtain_jwt(request.data['username']))


class RefreshToken(APIView):
    serializer_class = RefreshTokenSerializer

    def post(self, request):
        self.serializer_class().validate(request.data)

        return Response(GenerateJwt().refresh_token(request.data['token']))


class TestAuth(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'auth': 'success'})
