from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Relationship
from .serializers import RelationshipSerializer

class RelationshipViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = RelationshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Relationship.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=['get'])
    def friends(self, request):
        friends = Relationship.objects.filter(
            (Q(sender=request.user) | Q(receiver=request.user)) &
            Q(status=Relationship.ACCEPTED)
        )
        serializer = self.get_serializer(friends, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        pending = Relationship.objects.filter(
            receiver=request.user,
            status=Relationship.PENDING
        )
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        relationship = self.get_object()
        if relationship.receiver != request.user:
            return Response(
                {"error": "Vous ne pouvez pas accepter cette demande"},
                status=status.HTTP_403_FORBIDDEN
            )
        relationship.status = Relationship.ACCEPTED
        relationship.save()
        serializer = self.get_serializer(relationship)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        relationship = self.get_object()
        if relationship.receiver != request.user:
            return Response(
                {"error": "Vous ne pouvez pas rejeter cette demande"},
                status=status.HTTP_403_FORBIDDEN
            )
        relationship.status = Relationship.REJECTED
        relationship.save()
        serializer = self.get_serializer(relationship)
        return Response(serializer.data)
