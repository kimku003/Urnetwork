from django.urls import path
from .views import UserViewSet, RegisterView, LoginView, UserProfileView, UserSettingsView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
    path('users/<str:username>/', UserViewSet.as_view({'get': 'retrieve'}), name='user-detail'),
    path('users/settings/update/', UserSettingsView.as_view(), name='user-settings'),
]