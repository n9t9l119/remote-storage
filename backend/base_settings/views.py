from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from base_settings.serializers import RegisterSerializer, LoginSerializer, RefreshTokenSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

from remoteStorage.rest_api.jwt.generate_jwt import GenerateJwt


def obtain_tokens(request):
    jwt_tokens = GenerateJwt().obtain_jwt(request.data['username'])
    response = Response(jwt_tokens)
    response.set_cookie('refresh_token', jwt_tokens['refresh'], samesite='Lax')

    return response


def refresh_tokens(refresh_token):
    jwt_tokens = GenerateJwt().refresh_token(refresh_token)
    response = Response(jwt_tokens)
    response.set_cookie('refresh_token', jwt_tokens['refresh'], samesite='Lax')

    return response


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        RegisterSerializer(data=request.data).is_valid(raise_exception=True)
        self.create(request, *args, **kwargs)

        return obtain_tokens(request)


class LogIn(APIView):

    def post(self, request, *args, **kwargs):
        LoginSerializer(data=request.data).is_valid(raise_exception=True)

        return obtain_tokens(request)


class LogOut(APIView):

    def get(self, request):
        response = Response()
        response.delete_cookie('refresh_token')

        return response


class RefreshToken(APIView):
    serializer_class = RefreshTokenSerializer

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token is None:
            self.serializer_class().validate(refresh_token)

        return refresh_tokens(refresh_token)


class TestAuth(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'auth': 'success'})
