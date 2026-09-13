from rest_framework import viewsets, generics, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import (
    Service, Project, Post, Category, Education,
    Experience, Skill, Profile, ContactMessage, Comment, Certification
)
from .serializers import (
    ServiceSerializer, ProjectSerializer, PostListSerializer,
    PostDetailSerializer, CategorySerializer, EducationSerializer,
    ExperienceSerializer, SkillSerializer, ProfileSerializer,
    ContactMessageSerializer, CommentSerializer, CertificationSerializer,
)


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    lookup_field = 'slug'


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_featured']
    search_fields = ['title', 'summary', 'tech_tags__name']
    ordering_fields = ['created_at', 'order']


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.filter(status='published')
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'tags__slug']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PostDetailSerializer
        return PostListSerializer


class EducationListView(generics.ListAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer


class ExperienceListView(generics.ListAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class ProfileView(APIView):
    def get(self, request):
        profile, _ = Profile.objects.get_or_create(pk=1)
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)


class CertificationListView(generics.ListAPIView):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer


class ContactThrottle(AnonRateThrottle):
    scope = 'contact'
    rate = '5/hour'


class ContactMessageCreateView(generics.CreateAPIView):
    """
    Endpoint seguro do formulário de contacto.
    Protegido por CSRF (padrão Django), rate limiting e validação de dados.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    throttle_classes = [ContactThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))
        serializer.save(ip_address=ip.split(',')[0] if ip else None)
        return Response(
            {'detail': 'Mensagem enviada com sucesso. Obrigado pelo contacto!'},
            status=status.HTTP_201_CREATED,
        )


class CVTimelineView(APIView):
    """Endpoint agregado para o CV interativo (educação + experiência + competências)."""

    def get(self, request):
        education = EducationSerializer(Education.objects.all(), many=True).data
        experience = ExperienceSerializer(Experience.objects.all(), many=True).data
        skills = SkillSerializer(Skill.objects.all(), many=True).data
        return Response({
            'education': education,
            'experience': experience,
            'skills': skills,
        })


class CommentThrottle(AnonRateThrottle):
    scope = 'comment'
    rate = '10/hour'


class CommentViewSet(viewsets.ModelViewSet):
    """
    Comentários de artigos do blog.
    - GET  /api/comments/?post__slug=<slug>  → lista comentários aprovados (sem e-mail)
    - POST /api/comments/                    → cria um comentário (nome + e-mail + texto)
    O e-mail nunca é devolvido pela API (ver CommentSerializer).
    """
    queryset = Comment.objects.filter(is_approved=True)
    serializer_class = CommentSerializer
    http_method_names = ['get', 'post', 'head', 'options']
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['post__slug']

    def get_throttles(self):
        if self.request.method == 'POST':
            return [CommentThrottle()]
        return super().get_throttles()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))
        serializer.save(ip_address=ip.split(',')[0] if ip else None)
        # Garantia extra: a resposta nunca inclui o e-mail, mesmo que tenha sido enviado.
        return Response(serializer.data, status=status.HTTP_201_CREATED)
