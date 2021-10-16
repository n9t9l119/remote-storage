from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from remoteStorage.rest_api.jwt.generate_jwt import GenerateJwt


def index(request):
    return render(request, 'index.html', {})


class GetTokens(APIView):

    def get(self, request):
        tokens_generator = GenerateJwt()
        tokens = {
            'access': tokens_generator.generate_access_token(),
            'refresh': tokens_generator.generate_refresh_token(),
        }
        return Response(tokens)
