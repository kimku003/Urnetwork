from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, LoginView, UserProfileView, UserSettingsView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
    path('users/settings/update/', UserSettingsView.as_view(), name='user-settings'),
] + router.urls