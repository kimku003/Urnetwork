from rest_framework import serializers
from .models import DirectMessage
from users.serializers import UserSerializer

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