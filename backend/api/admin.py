from django.contrib import admin
from .models import (
    Service, Project, Post, Category, Education,
    Experience, Skill, Profile, ContactMessage, Comment, Certification
)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'short_description')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'is_featured', 'order', 'created_at')
    list_editable = ('is_featured', 'order')
    list_filter = ('status', 'is_featured')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'summary')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'published_at', 'reading_time_minutes')
    list_filter = ('status', 'category')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'excerpt', 'content')
    date_hierarchy = 'published_at'
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'excerpt', 'content', 'cover_image')}),
        ('Organização', {'fields': ('category', 'tags', 'status', 'published_at')}),
        ('SEO / Open Graph', {'fields': ('meta_title', 'meta_description')}),
    )


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_date', 'end_date')
    list_editable = ()
    ordering = ('order',)


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'experience_type', 'start_date', 'is_current')
    list_filter = ('experience_type', 'is_current')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency', 'order')
    list_editable = ('proficiency', 'order')
    list_filter = ('category',)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'headline', 'location')

    def has_add_permission(self, request):
        return not Profile.objects.exists()


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'issuer', 'issue_date', 'order')
    list_editable = ('order',)
    ordering = ('order', '-issue_date')
    search_fields = ('title', 'issuer')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created_at')
    list_editable = ('is_read',)
    list_filter = ('is_read', 'created_at')
    readonly_fields = ('name', 'email', 'subject', 'message', 'ip_address', 'created_at')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('name', 'post', 'is_approved', 'created_at')
    list_editable = ('is_approved',)
    list_filter = ('is_approved', 'created_at')
    search_fields = ('name', 'email', 'content')
    readonly_fields = ('name', 'email', 'content', 'post', 'ip_address', 'created_at')
