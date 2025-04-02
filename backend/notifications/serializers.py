from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'recipient',
            'notification_type',
            'notification_type_display',
            'sender',
            'sender_username',
            'post',
            'read',
            'created_at'
        ]
        read_only_fields = ['recipient', 'sender']