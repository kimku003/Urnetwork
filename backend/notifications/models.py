from django.db import models
from django.conf import settings

class Notification(models.Model):
    FRIEND_REQUEST = 'friend_request'
    POST_LIKE = 'post_like'
    POST_COMMENT = 'post_comment'
    
    NOTIFICATION_TYPES = [
        (FRIEND_REQUEST, 'Demande d\'ami'),
        (POST_LIKE, 'J\'aime sur un post'),
        (POST_COMMENT, 'Commentaire sur un post'),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_notifications'
    )
    post = models.ForeignKey(
        'posts.Post',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} de {self.sender} pour {self.recipient}"
