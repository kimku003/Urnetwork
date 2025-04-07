from django.db import models
from django.conf import settings
from notifications.models import Notification

class Relationship(models.Model):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'
    
    STATUS_CHOICES = [
        (PENDING, 'En attente'),
        (ACCEPTED, 'Acceptée'),
        (REJECTED, 'Rejetée'),
    ]

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_relationships'
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_relationships'
    )
    status = models.CharField(
        max_length=8,
        choices=STATUS_CHOICES,
        default=PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['sender', 'receiver']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username} ({self.status})"

    def save(self, *args, **kwargs):
        if self.pk is None and self.status == self.PENDING:
            # Créer une notification pour le destinataire
            Notification.objects.create(
                user=self.receiver,
                notification_type='friend_request',
                sender=self.sender,
                text=f"{self.sender.username} vous a envoyé une demande d'ami."
            )
        super().save(*args, **kwargs)
