import jwt

from django.utils import timezone
from dotenv import dotenv_values


class GenerateJwt:
    config = dotenv_values(".env")

    def _generate_token(self, secret_key, expiration_time):
        current_time = timezone.now()
        expires_time = current_time + timezone.timedelta(seconds=expiration_time)
        payload = {
            'uid': 1,
            'iat': current_time.timestamp(),
            'exp': expires_time.timestamp(),
        }
        return jwt.encode(payload, secret_key, 'HS256')

    def generate_access_token(self):
        return self._generate_token(
            self.config['ACCESS_TOKEN_SECRET_KEY'],
            int(self.config['ACCESS_TOKEN_EXPIRATION_TIME']),
        )

    def generate_refresh_token(self):
        return self._generate_token(
            self.config['REFRESH_TOKEN_SECRET_KEY'],
            int(self.config['REFRESH_TOKEN_EXPIRATION_TIME']),
        )
