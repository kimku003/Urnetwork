from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, LoginView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')  # Ajout du basename

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),
]