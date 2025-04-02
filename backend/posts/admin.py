from django.contrib import admin
from .models import Post, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('author', 'content', 'created_at', 'get_likes_count')
    list_filter = ('created_at', 'author')
    search_fields = ('content', 'author__username')
    readonly_fields = ('created_at', 'updated_at')

    def get_likes_count(self, obj):
        return obj.likes.count()
    get_likes_count.short_description = 'Nombre de likes'

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'content', 'created_at')
    list_filter = ('created_at', 'author')
    search_fields = ('content', 'author__username')
    readonly_fields = ('created_at', 'updated_at')
