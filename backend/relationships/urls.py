from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RelationshipViewSet

router = DefaultRouter()
router.register(r'relationships', RelationshipViewSet)

urlpatterns = [
    path('', include(router.urls)),
]