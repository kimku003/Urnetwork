from rest_framework import serializers
from .models import Relationship

class RelationshipSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = Relationship
        fields = [
            'id',
            'sender',
            'receiver',
            'status',
            'created_at',
            'updated_at',
            'sender_username',
            'receiver_username'
        ]
        read_only_fields = ['sender', 'status']