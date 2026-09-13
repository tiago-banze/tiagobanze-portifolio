from rest_framework import serializers
from taggit.serializers import TagListSerializerField, TaggitSerializer
from .models import (
    Service, Project, Post, Category, Education,
    Experience, Skill, Profile, ContactMessage, Comment, Certification
)


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'slug', 'short_description', 'description', 'icon', 'order']


class ProjectSerializer(TaggitSerializer, serializers.ModelSerializer):
    tech_tags = TagListSerializerField()
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'summary', 'problem', 'solution',
            'cover_image', 'tech_tags', 'repo_url', 'live_url',
            'status', 'is_featured', 'created_at',
        ]

    def get_cover_image(self, obj):
        request = self.context.get('request')
        if obj.cover_image and hasattr(obj.cover_image, 'url'):
            return request.build_absolute_uri(obj.cover_image.url) if request else obj.cover_image.url
        return None


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class PostListSerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()
    category = CategorySerializer(read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt', 'cover_image', 'category',
            'tags', 'published_at', 'reading_time_minutes',
        ]

    def get_cover_image(self, obj):
        request = self.context.get('request')
        if obj.cover_image and hasattr(obj.cover_image, 'url'):
            return request.build_absolute_uri(obj.cover_image.url) if request else obj.cover_image.url
        return None


class PostDetailSerializer(PostListSerializer):
    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + [
            'content', 'meta_title', 'meta_description',
        ]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'location', 'start_date', 'end_date', 'description']


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id', 'title', 'organization', 'location', 'experience_type',
            'start_date', 'end_date', 'is_current', 'description',
        ]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'proficiency']


class ProfileSerializer(serializers.ModelSerializer):
    cv_file = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    about_image = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            'full_name', 'headline', 'bio_short', 'bio_long', 'location',
            'email', 'whatsapp_number', 'github_url', 'facebook_url',
            'cv_file', 'avatar', 'about_image',
        ]

    def get_cv_file(self, obj):
        request = self.context.get('request')
        if obj.cv_file and hasattr(obj.cv_file, 'url'):
            return request.build_absolute_uri(obj.cv_file.url) if request else obj.cv_file.url
        return None

    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar and hasattr(obj.avatar, 'url'):
            return request.build_absolute_uri(obj.avatar.url) if request else obj.avatar.url
        return None

    def get_about_image(self, obj):
        request = self.context.get('request')
        if obj.about_image and hasattr(obj.about_image, 'url'):
            return request.build_absolute_uri(obj.about_image.url) if request else obj.about_image.url
        return None


class CertificationSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()
    is_pdf = serializers.BooleanField(read_only=True)

    class Meta:
        model = Certification
        fields = [
            'id', 'title', 'issuer', 'issuer_url', 'issue_date',
            'credential_url', 'file', 'is_pdf',
        ]

    def get_file(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            return request.build_absolute_uri(obj.file.url) if request else obj.file.url
        return None


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError('A mensagem deve ter pelo menos 10 caracteres.')
        return value


class CommentSerializer(serializers.ModelSerializer):
    """
    O campo 'email' é write_only: é aceite na criação (POST) para validação,
    mas NUNCA é incluído na resposta da API — nem em listagens, nem no próprio
    objeto recém-criado. Isto garante que o e-mail do leitor nunca fica público.
    """
    class Meta:
        model = Comment
        fields = ['id', 'post', 'name', 'email', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {
            'email': {'write_only': True},
            'post': {'write_only': True},
        }

    def validate_content(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError('O comentário é demasiado curto.')
        return value
