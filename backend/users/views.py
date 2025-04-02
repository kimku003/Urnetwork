from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from .models import User
from .serializers import UserSerializer, UserUpdateSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()  # Ajout de l'attribut queryset
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()

    def get_serializer_class(self):
        if self.action == 'update' or self.action == 'partial_update':
            return UserUpdateSerializer
        return UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        try:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        except Exception as e:
            print(f"Erreur dans /me/: {str(e)}")
            return Response(
                {"error": "Erreur lors de la récupération du profil"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        user = request.user
        friends = User.objects.filter(
            received_relationships__sender=user,
            received_relationships__status='accepted'
        ) | User.objects.filter(
            sent_relationships__receiver=user,
            sent_relationships__status='accepted'
        )
        
        suggestions = User.objects.exclude(
            id__in=[user.id] + list(friends.values_list('id', flat=True))
        )[:5]
        
        serializer = self.get_serializer(suggestions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('query', '')
        if len(query) >= 3:
            users = User.objects.filter(
                Q(username__icontains=query) |
                Q(email__icontains=query)
            ).exclude(id=request.user.id)
            serializer = self.get_serializer(users, many=True)
            return Response(serializer.data)
        return Response([])

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        print("Login attempt:", request.data)  # Pour le débogage
        return super().post(request, *args, **kwargs)
