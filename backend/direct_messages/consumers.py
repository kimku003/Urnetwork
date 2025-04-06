import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import DirectMessage
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from jwt import decode as jwt_decode
from django.conf import settings

User = get_user_model()

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            # Récupérer le token depuis les query parameters
            query_string = scope.get('query_string', b'').decode()
            token = dict(param.split('=') for param in query_string.split('&')).get('token', None)

            if token:
                # Décoder le token JWT
                decoded_token = jwt_decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = decoded_token.get('user_id')
                if user_id:
                    scope['user'] = await self.get_user(user_id)
                    return await super().__call__(scope, receive, send)
            
            scope['user'] = AnonymousUser()
            return await super().__call__(scope, receive, send)
        except Exception as e:
            print(f"Erreur d'authentification WebSocket: {e}")
            scope['user'] = AnonymousUser()
            return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        recipient_id = data['recipient_id']

        message_instance = await self.save_message(message, recipient_id)
        
        # Notifier les deux participants
        for group_name in [
            f'chat_{self.room_name}',
            f'notifications_{recipient_id}'
        ]:
            await self.channel_layer.group_send(
                group_name,
                {
                    'type': 'chat_message',
                    'message': message_instance
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_message',
            'message': event['message']
        }))

    @database_sync_to_async
    def save_message(self, content, recipient_id):
        message = DirectMessage.objects.create(
            sender=self.user,
            recipient_id=recipient_id,
            content=content
        )
        from .serializers import DirectMessageSerializer
        return DirectMessageSerializer(message).data

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close()
            return

        self.room_name = f"notifications_{user.id}"
        self.room_group_name = f"notifications_{user.id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        pass

    async def notification_message(self, event):
        await self.send(text_data=json.dumps(event))