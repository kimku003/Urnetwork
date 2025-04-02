from rest_framework import serializers
from .models import Post, Reaction, Comment

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
    image_url = serializers.SerializerMethodField()
    original_post_data = serializers.SerializerMethodField()
    reactions_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_username', 'content',
            'image', 'image_url', 'created_at', 'updated_at',
            'original_post', 'original_post_data', 'share_count',
            'reactions_count', 'comments_count', 'user_reaction'
        ]
        read_only_fields = ['author', 'share_count']

    def get_original_post_data(self, obj):
        if obj.original_post:
            return {
                'id': obj.original_post.id,
                'author_username': obj.original_post.author.username,
                'content': obj.original_post.content,
                'image_url': self.get_image_url(obj.original_post),
                'created_at': obj.original_post.created_at,
            }
        return None

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None

    def get_reactions_count(self, obj):
        return obj.reactions.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            if reaction:
                return {'type': reaction.reaction_type, 'emoji': reaction.get_reaction_type_display()}
        return None