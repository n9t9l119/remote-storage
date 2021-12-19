from rest_framework import serializers

from base_settings.models import User


class RefreshTokenSerializer(serializers.ModelSerializer):
    token = serializers.CharField()


class LoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField()

    class Meta:
        model = User
        fields = ('username', 'password')

    def validate(self, attrs):
        user = User.objects.filter(username=attrs.get('username')).first()
        if user is None or not user.check_password(attrs.get('password')):
            raise serializers.ValidationError({"error": "Incorrect credentials"})
        return attrs


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
    )

    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name="aaa",  # validated_data['first_name'],
            last_name="bbb"  # validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
