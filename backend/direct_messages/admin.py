from django.contrib import admin
from .models import DirectMessage

@admin.register(DirectMessage)
class DirectMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'content', 'created_at', 'read')
    list_filter = ('read', 'created_at', 'sender', 'recipient')
    search_fields = ('sender__username', 'recipient__username', 'content')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    list_per_page = 25
    
    fieldsets = (
        ('Message', {
            'fields': ('content',)
        }),
        ('Détails', {
            'fields': ('sender', 'recipient', 'read')
        }),
        ('Horodatage', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at',)
# Register your models here.
