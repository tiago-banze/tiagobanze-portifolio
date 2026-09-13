"""
Django settings for the Tiago Victor Banze Portfolio backend.

Projetado para rodar localmente com SQLite e migrar sem atrito
para PostgreSQL em produção (via DATABASE_URL).
"""
from pathlib import Path
from decouple import config, Csv
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# ----------------------------------------------------------------------------
# Segurança
# ----------------------------------------------------------------------------
SECRET_KEY = config('DJANGO_SECRET_KEY', default='django-insecure-change-me-in-production-#tv-banze#')
DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='localhost,127.0.0.1',
    cast=Csv()
)

# Em produção (DEBUG=False) forçamos boas práticas de segurança nativa do Django.
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'

# ----------------------------------------------------------------------------
# Apps
# ----------------------------------------------------------------------------
INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',

    # Third-party
    'rest_framework',
    'corsheaders',
    'django_filters',
    'taggit',
]

# O Vercel apaga tudo o que for enviado (avatar, CV, certificados) a cada novo
# deploy, porque o disco é temporário. Por isso, em produção guardamos esses
# ficheiros no Cloudinary (gratuito) em vez do disco local.
# Basta definir CLOUDINARY_URL nas variáveis de ambiente do Vercel; em
# desenvolvimento local (sem essa variável), continua tudo a ir para media/.
CLOUDINARY_URL = config('CLOUDINARY_URL', default='')
if CLOUDINARY_URL:
    INSTALLED_APPS += ['cloudinary_storage', 'cloudinary']
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

INSTALLED_APPS += ['api']

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'

# ----------------------------------------------------------------------------
# Base de Dados
# SQLite em desenvolvimento. Basta definir DATABASE_URL em produção para
# migrar automaticamente para PostgreSQL (ex: Neon, Supabase, Railway).
# ----------------------------------------------------------------------------
DATABASE_URL = config('DATABASE_URL', default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
DATABASES = {
    'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600)
}

# ----------------------------------------------------------------------------
# Validação de senha
# ----------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ----------------------------------------------------------------------------
# Internacionalização
# ----------------------------------------------------------------------------
LANGUAGE_CODE = 'pt-mz'
TIME_ZONE = 'Africa/Maputo'
USE_I18N = True
USE_TZ = True

# ----------------------------------------------------------------------------
# Ficheiros estáticos e media
# ----------------------------------------------------------------------------
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ----------------------------------------------------------------------------
# CORS — permite que o front-end Next.js consuma a API
# ----------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000',
    cast=Csv()
)
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = config(
    'CSRF_TRUSTED_ORIGINS',
    default='http://localhost:3000',
    cast=Csv()
)

# ----------------------------------------------------------------------------
# Django REST Framework
# ----------------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 9,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/minute',
        'contact': '5/hour',
        'comment': '10/hour',
    },
}

# ----------------------------------------------------------------------------
# Dados do proprietário (usados no endpoint /api/profile/ e no admin)
# ----------------------------------------------------------------------------
SITE_URL = config('SITE_URL', default='https://tiagobanze.dev')

# ----------------------------------------------------------------------------
# Jazzmin — tema visual do painel /admin
# ----------------------------------------------------------------------------
JAZZMIN_SETTINGS = {
    "site_title": "Painel Tiago Victor Banze",
    "site_header": "Tiago Victor Banze",
    "site_brand": "Tiago Victor Banze",
    "welcome_sign": "Bem-vindo ao painel do seu portfólio",
    "copyright": "Tiago Victor Banze",
    "search_model": ["api.Post", "api.Project"],
    "show_sidebar": True,
    "navigation_expanded": True,
    "icons": {
        "api.Profile": "fas fa-user-circle",
        "api.Service": "fas fa-tools",
        "api.Project": "fas fa-code-branch",
        "api.Post": "fas fa-newspaper",
        "api.Category": "fas fa-tags",
        "api.Education": "fas fa-graduation-cap",
        "api.Experience": "fas fa-briefcase",
        "api.Skill": "fas fa-chart-bar",
        "api.ContactMessage": "fas fa-envelope",
        "api.Comment": "fas fa-comments",
        "auth.User": "fas fa-user",
        "auth.Group": "fas fa-users",
    },
    "order_with_respect_to": [
        "api.Profile", "api.Service", "api.Project", "api.Category", "api.Post",
        "api.Comment", "api.Education", "api.Experience", "api.Skill", "api.ContactMessage",
    ],
    "hide_apps": [],
    "hide_models": [],
    "custom_css": "css/jazzmin-custom.css",
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": True,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-dark",
    "accent": "accent-teal",
    "navbar": "navbar-dark",
    "no_navbar_border": True,
    "navbar_fixed": True,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "theme": "flatly",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-outline-primary",
        "secondary": "btn-outline-secondary",
        "info": "btn-outline-info",
        "warning": "btn-outline-warning",
        "danger": "btn-outline-danger",
        "success": "btn-outline-success",
    },
}
