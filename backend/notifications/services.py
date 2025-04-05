from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification
from django.contrib.contenttypes.models import ContentType

def send_notification(user, notification_type, related_object, sender, text):
    # Créer la notification en base de données
    notification = Notification.objects.create(
        user=user,
        notification_type=notification_type,
        content_type=ContentType.objects.get_for_model(related_object),
        object_id=related_object.id,
        sender=sender,
        text=text
    )

    # Envoyer la notification via WebSocket
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user.id}_notifications",
        {
            "type": "notification",
            "data": {
                "id": notification.id,
                "type": notification_type,
                "text": text,
                "sender": {
                    "id": sender.id,
                    "username": sender.username
                },
                "created_at": notification.created_at.isoformat()
            }
        }
    )