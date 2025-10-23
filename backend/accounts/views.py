from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class LoginView(TokenObtainPairView):
    """
    User login view that returns JWT tokens and user info.
    
    POST /api/auth/login/
    {
        "username": "admin",
        "password": "admin123"
    }
    
    Returns:
    {
        "access": "eyJ0eXAiOiJKV1Qi...",
        "refresh": "eyJ0eXAiOiJKV1Qi...",
        "user": {
            "id": 1,
            "username": "admin",
            "email": "admin@example.com",
            "first_name": "Admin",
            "last_name": "User"
        }
    }
    """
    serializer_class = LoginSerializer