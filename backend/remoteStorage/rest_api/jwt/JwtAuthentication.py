import jwt
from rest_framework.authentication import CSRFCheck

from base_settings.models import User
from rest_framework import authentication, exceptions

from remoteStorage.rest_api.jwt.generate_jwt import GenerateJwt


class JwtAuthentication(authentication.BaseAuthentication):
    PREFIX = 'JWT'

    def authenticate(self, request):
        authorization_heaader = request.headers.get('Authorization')

        if not authorization_heaader:
            return None
        try:
            header_prefix, access_token = authorization_heaader.split(' ')

            if header_prefix != self.PREFIX:
                raise exceptions.AuthenticationFailed('Incorrect header prefix')

            payload = GenerateJwt().get_payload_data(access_token)

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('access_token expired')

        user = User.objects.filter(user_id=payload['uid']).first()

        if user is None:
            raise exceptions.AuthenticationFailed('User not found')

        if not user.is_active:
            raise exceptions.AuthenticationFailed('user is inactive')

        self.enforce_csrf(request)

        return user, access_token

    def enforce_csrf(self, request):

        check = CSRFCheck()
        check.process_request(request)
        reason = check.process_view(request, None, (), {})

        if reason:
            raise exceptions.PermissionDenied(f'CSRF Failed: {reason}')
