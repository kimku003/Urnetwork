from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Reaction, Comment
from .serializers import PostSerializer, ReactionSerializer, CommentSerializer

# Create your views here.

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        if request.user in post.likes.all():
            post.likes.remove(request.user)
            return Response({'status': 'unliked'})
        else:
            post.likes.add(request.user)
            return Response({'status': 'liked'})

    @action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        post = self.get_object()
        reaction_type = request.data.get('reaction_type')
        
        if reaction_type not in dict(Reaction.REACTION_CHOICES):
            return Response(
                {'error': 'Type de réaction invalide'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reaction, created = Reaction.objects.get_or_create(
            user=request.user,
            post=post,
            defaults={'reaction_type': reaction_type}
        )
        
        if not created:
            if reaction.reaction_type == reaction_type:
                reaction.delete()
                return Response({'status': 'reaction removed'})
            reaction.reaction_type = reaction_type
            reaction.save()
        
        return Response(ReactionSerializer(reaction).data)

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        post = self.get_object()
        serializer = CommentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        original_post = self.get_object()
        content = request.data.get('content', '')
        
        shared_post = Post.objects.create(
            author=request.user,
            content=content,
            original_post=original_post
        )
        
        original_post.share_count += 1
        original_post.save()
        
        serializer = self.get_serializer(shared_post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user,
            post_id=self.kwargs.get('post_pk')
        )
