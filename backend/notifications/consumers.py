import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close()
            return

        self.room_name = f"user_{user.id}_notifications"
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get("type")
        
        if message_type == "mark_as_read":
            await self.mark_notification_as_read(data.get("notification_id"))

    async def notification(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        from .models import Notification
        Notification.objects.filter(
            id=notification_id,
            user=self.scope["user"]
        ).update(is_read=True)