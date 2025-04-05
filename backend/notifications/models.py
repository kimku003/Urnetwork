from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('comment', 'Nouveau commentaire'),
        ('friend_request', 'Demande d\'ami'),
        ('mention', 'Mention'),
        ('like', 'J\'aime')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    content_type = models.ForeignKey(
        ContentType, 
        on_delete=models.CASCADE,
        default=ContentType.objects.get_for_model(User).id
    )
    object_id = models.PositiveIntegerField(default=1)
    content_object = GenericForeignKey('content_type', 'object_id')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    text = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ]
