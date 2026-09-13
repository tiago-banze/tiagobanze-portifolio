from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'services', views.ServiceViewSet, basename='service')
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'comments', views.CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('certifications/', views.CertificationListView.as_view(), name='certification-list'),
    path('education/', views.EducationListView.as_view(), name='education-list'),
    path('experience/', views.ExperienceListView.as_view(), name='experience-list'),
    path('skills/', views.SkillListView.as_view(), name='skill-list'),
    path('cv/', views.CVTimelineView.as_view(), name='cv-timeline'),
    path('contact/', views.ContactMessageCreateView.as_view(), name='contact-create'),
]
