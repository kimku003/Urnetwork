from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DirectMessageViewSet

router = DefaultRouter()
router.register(r'messages', DirectMessageViewSet, basename='direct-message')

urlpatterns = [
    path('', include(router.urls)),
]