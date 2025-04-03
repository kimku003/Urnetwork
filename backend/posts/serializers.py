from rest_framework import serializers
from .models import Post, Reaction, Comment

class RecursiveSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'content', 'image', 'created_at', 'author_username']

class ReactionSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    reaction_emoji = serializers.CharField(source='get_reaction_type_display', read_only=True)

    class Meta:
        model = Reaction
        fields = ['id', 'user', 'user_username', 'post', 'reaction_type', 'reaction_emoji', 'created_at']
        read_only_fields = ['user']

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'post', 'content', 'created_at', 'author_username']
        read_only_fields = ['author_username']

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    share_count = serializers.IntegerField(read_only=True)
    original_post = RecursiveSerializer(read_only=True)
    is_shared = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'content', 'image', 'created_at', 'author_username', 
                 'comments', 'share_count', 'original_post', 'is_shared']

    def get_is_shared(self, obj):
        return obj.original_post is not None