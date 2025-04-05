from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import User
from .serializers import UserSerializer, UserUpdateSerializer, LoginSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'

    def get_queryset(self):
        return User.objects.filter(is_active=True)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request, username=None):
        user = self.get_object()
        if 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']
        if 'cover_picture' in request.FILES:
            user.cover_picture = request.FILES['cover_picture']
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'notifications_enabled': getattr(user, 'notifications_enabled', True),
            'email_notifications': getattr(user, 'email_notifications', True),
            'profile_privacy': getattr(user, 'profile_privacy', 'public'),
            'theme': getattr(user, 'theme', 'light')
        })

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'email': user.email,
            'notifications_enabled': getattr(user, 'notifications_enabled', True),
            'email_notifications': getattr(user, 'email_notifications', True),
            'profile_privacy': getattr(user, 'profile_privacy', 'public'),
            'theme': getattr(user, 'theme', 'light')
        })

    def post(self, request):
        user = request.user
        for field in ['notifications_enabled', 'email_notifications', 'profile_privacy', 'theme']:
            if field in request.data:
                setattr(user, field, request.data[field])
        
        if 'email' in request.data:
            user.email = request.data['email']
            
        if 'password' in request.data and request.data['password']:
            user.set_password(request.data['password'])
            
        user.save()
        return Response({'status': 'success'})

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            
            if user is not None:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': UserSerializer(user).data
                })
            
            return Response(
                {'error': 'Identifiants invalides'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
