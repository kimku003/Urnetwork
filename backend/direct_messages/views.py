from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.contrib.auth import get_user_model
import logging
from .models import DirectMessage
from .serializers import DirectMessageSerializer

User = get_user_model()
logger = logging.getLogger(__name__)

class DirectMessageViewSet(viewsets.ModelViewSet):
    serializer_class = DirectMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return DirectMessage.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).select_related('sender', 'recipient')

    @action(detail=False, methods=['GET'])
    def conversations(self, request):
        user = request.user
        
        # Récupérer tous les utilisateurs avec qui l'utilisateur actuel a échangé des messages
        conversations = DirectMessage.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).values(
            'sender', 
            'recipient'
        ).distinct()
        
        # Collecter tous les IDs des utilisateurs impliqués
        user_ids = set()
        for conv in conversations:
            user_ids.add(conv['sender'])
            user_ids.add(conv['recipient'])
        
        # Retirer l'ID de l'utilisateur actuel
        user_ids.discard(user.id)
        
        # Récupérer les utilisateurs avec leurs derniers messages
        users = User.objects.filter(id__in=user_ids)
        
        serializer = UserMessageSerializer(users, many=True, context={
            'request': request,
            'current_user': user
        })
        
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def with_user(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id est requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        messages = DirectMessage.objects.filter(
            (Q(sender=request.user) & Q(recipient_id=user_id)) |
            (Q(sender_id=user_id) & Q(recipient=request.user))
        ).select_related('sender', 'recipient')
        
        # Marquer les messages non lus comme lus
        messages.filter(recipient=request.user, read=False).update(read=True)
        
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Données reçues: {request.data}")
            serializer = self.get_serializer(data=request.data)
            
            if serializer.is_valid():
                logger.info("Données valides")
                self.perform_create(serializer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.error(f"Erreurs de validation: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Erreur lors de la création du message: {str(e)}")
            return Response(
                {"detail": "Une erreur est survenue lors de l'envoi du message"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
