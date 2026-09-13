from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from api.sitemaps import ProjectSitemap, PostSitemap, StaticViewSitemap

sitemaps = {
    'projects': ProjectSitemap,
    'posts': PostSitemap,
    'static': StaticViewSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Tiago Victor Banze — Administração do Portfólio"
admin.site.site_title = "Painel Tiago Banze"
admin.site.index_title = "Gestão de Conteúdo"
