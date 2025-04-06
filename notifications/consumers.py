import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'notifications'

        # Rejoindre le groupe
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Quitter le groupe
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message', '')

        # Envoyer le message au groupe
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'notification_message',
                'message': message
            }
        )

    async def notification_message(self, event):
        message = event['message']

        # Envoyer le message au WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))