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
        fields = ['id', 'author', 'author_username', 'post', 'content', 'created_at']
        read_only_fields = ['author']


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    image_url = serializers.SerializerMethodField()
    reactions_count = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'content', 'author', 'author_username', 
            'created_at', 'image', 'image_url',
            'reactions_count', 'user_reaction',
            'comments', 'comments_count'
        ]
        read_only_fields = ['author']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None

    def get_reactions_count(self, obj):
        return obj.reactions.count()

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            if reaction:
                return ReactionSerializer(reaction).data
        return None

    def get_comments_count(self, obj):
        return obj.comments.count()