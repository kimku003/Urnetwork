from django.contrib import admin
from .models import Relationship

@admin.register(Relationship)
class RelationshipAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('sender__username', 'receiver__username')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('sender', 'receiver')
