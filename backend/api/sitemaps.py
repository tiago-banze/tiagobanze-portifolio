from django.contrib.sitemaps import Sitemap
from django.conf import settings
from .models import Project, Post


class ProjectSitemap(Sitemap):
    changefreq = 'monthly'
    priority = 0.7
    protocol = 'https'

    def items(self):
        return Project.objects.all()

    def location(self, obj):
        return f'/projetos/{obj.slug}'

    def lastmod(self, obj):
        return obj.updated_at


class PostSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.8
    protocol = 'https'

    def items(self):
        return Post.objects.filter(status='published')

    def location(self, obj):
        return f'/blog/{obj.slug}'

    def lastmod(self, obj):
        return obj.updated_at


class StaticViewSitemap(Sitemap):
    changefreq = 'monthly'
    priority = 1.0
    protocol = 'https'

    def items(self):
        return ['', 'sobre', 'servicos', 'projetos', 'blog', 'cv', 'contacto']

    def location(self, item):
        return f'/{item}'
