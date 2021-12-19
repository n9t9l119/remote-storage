import jwt

from base_settings.models import User
from rest_framework import authentication, exceptions

from remoteStorage.rest_api.jwt.generate_jwt import GenerateJwt


class JwtAuthentication(authentication.BaseAuthentication):
    PREFIX = 'JWT'

    def authenticate(self, request):
        authorization_header = request.headers.get('Authorization')

        if not authorization_header:
            return None, ''
        try:
            header_prefix, access_token = authorization_header.split(' ')

            if header_prefix != self.PREFIX:
                raise exceptions.AuthenticationFailed('Incorrect header prefix')

            payload = GenerateJwt().get_payload_data(access_token)

            user = User.objects.filter(user_id=payload['uid']).first()

            if user is None:
                raise exceptions.AuthenticationFailed('User not found')

            if not user.is_active:
                raise exceptions.AuthenticationFailed('user is inactive')

        except jwt.ExpiredSignatureError:
            user = None

        return user, access_token

    def authenticate_header(self, request):
        return '401 Unauthenticated'
