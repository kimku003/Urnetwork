from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import DirectMessage
from users.serializers import UserSerializer

User = get_user_model()

class DirectMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    recipient_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = DirectMessage
        fields = ['id', 'sender', 'recipient', 'recipient_id', 'content', 'created_at', 'read']
        read_only_fields = ['sender', 'created_at']

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        validated_data['recipient'] = validated_data.pop('recipient_id')
        return super().create(validated_data)

class UserMessageSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_pic', 'last_message', 'unread_count']

    def get_last_message(self, user):
        current_user = self.context['current_user']
        last_message = DirectMessage.objects.filter(
            Q(sender=current_user, recipient=user) |
            Q(sender=user, recipient=current_user)
        ).order_by('-created_at').first()

        if last_message:
            return {
                'content': last_message.content,
                'created_at': last_message.created_at,
                'is_sender': last_message.sender == current_user
            }
        return None

    def get_unread_count(self, user):
        current_user = self.context['current_user']
        return DirectMessage.objects.filter(
            sender=user,
            recipient=current_user,
            read=False
        ).count()