import os

import jwt

from django.utils import timezone
from dotenv import dotenv_values

from base_settings.models import User
from remoteStorage.settings import BASE_DIR


class GenerateJwt:
    config = dotenv_values(os.path.join(BASE_DIR, '.env'))

    def get_payload_data(self, token, access_token=False):
        secret_key = self.config['REFRESH_TOKEN_SECRET_KEY'] \
            if access_token else self.config['ACCESS_TOKEN_SECRET_KEY']
        payload = jwt.decode(
            token,
            secret_key,
            algorithms=['HS256'],
        )

        return payload

    def _generate_token(self, secret_key, expiration_time, username):
        current_time = timezone.now()
        expires_time = current_time + timezone.timedelta(seconds=expiration_time)
        user = User.objects.filter(username=username).first()
        payload = {
            'uid': str(user.user_id),
            'iat': current_time.timestamp(),
            'exp': expires_time.timestamp(),
        }
        return jwt.encode(payload, secret_key, 'HS256')

    def generate_access_token(self, username):
        return self._generate_token(
            self.config['ACCESS_TOKEN_SECRET_KEY'],
            int(self.config['ACCESS_TOKEN_EXPIRATION_TIME']),
            username,
        )

    def generate_refresh_token(self, username):
        return self._generate_token(
            self.config['REFRESH_TOKEN_SECRET_KEY'],
            int(self.config['REFRESH_TOKEN_EXPIRATION_TIME']),
            username,
        )

    def refresh_token(self, refresh_token):
        try:
            payload = jwt.decode(
                refresh_token,
                self.config['REFRESH_TOKEN_SECRET_KEY'],
                algorithms=['HS256'],
            )
        except Exception as e:
            #'token is dead'
            raise Exception(str(e))

        user = User.objects.get(user_id=payload['uid'])

        if user is None:
            raise Exception('User does not exist')

        return self.obtain_jwt(user.username)

    def obtain_jwt(self, username):
        return {
            'access': self.generate_access_token(username),
            'refresh': self.generate_refresh_token(username),
        }
