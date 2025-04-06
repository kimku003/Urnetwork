from django.contrib import admin
from .models import DirectMessage

@admin.register(DirectMessage)
class DirectMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'created_at', 'read')
    list_filter = ('read', 'created_at')
    search_fields = ('sender__username', 'recipient__username', 'content')
    ordering = ('-created_at',)
# Register your models here.
