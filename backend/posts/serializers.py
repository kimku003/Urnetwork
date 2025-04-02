from rest_framework import serializers
from .models import Post, Comment

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'author_username', 'created_at', 'updated_at']
        read_only_fields = ['author']


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'content', 'image', 'author', 'author_username', 
                 'created_at', 'updated_at', 'comments', 'likes_count']
        read_only_fields = ['author']

    def get_likes_count(self, obj):
        return obj.likes.count()