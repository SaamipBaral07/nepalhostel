"""Django settings for the Nepal Hostel Finder backend."""

import os
from datetime import timedelta
from pathlib import Path

from decouple import Csv, config
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / "subdir".
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent

# Load env files from both backend and project root.
# This allows local dev keys stored in root .env.local to be visible to Django.
load_dotenv(BASE_DIR / ".env")
load_dotenv(PROJECT_ROOT / ".env")
load_dotenv(PROJECT_ROOT / ".env.local")


def env_with_alias(
    primary: str,
    *,
    aliases: tuple[str, ...] = (),
    default=None,
    cast=str,
):
    """Read env var from primary key, then fallback aliases, with optional casting."""
    raw = os.getenv(primary)
    if raw in (None, ""):
        for alias in aliases:
            alias_raw = os.getenv(alias)
            if alias_raw not in (None, ""):
                raw = alias_raw
                break

    if raw in (None, ""):
        return default

    if cast is bool:
        return str(raw).strip().lower() in {"1", "true", "yes", "on"}
    if cast is Csv:
        # Kept for compatibility; not used directly.
        return Csv()(raw)
    return cast(raw)


# Quick-start development settings - unsuitable for production
SECRET_KEY = config(
    "SECRET_KEY",
    default=env_with_alias(
        "SECRET_KEY",
        aliases=("DJANGO_SECRET_KEY",),
        default="django-insecure-change-me-in-production",
    ),
)

DEBUG = env_with_alias(
    "DEBUG",
    aliases=("DJANGO_DEBUG",),
    default=True,
    cast=bool,
)

ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    default=env_with_alias(
        "ALLOWED_HOSTS",
        aliases=("DJANGO_ALLOWED_HOSTS",),
        default="127.0.0.1,localhost",
    ),
    cast=Csv(),
)


# Application definition
INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "core",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "core.middleware.security.SecurityHeadersMiddleware",  # Custom security headers
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"


# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kathmandu"
USE_I18N = True
USE_TZ = True


# Static & media
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Custom user model
AUTH_USER_MODEL = "core.User"


# CORS
CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:3000,http://127.0.0.1:3000",
    cast=Csv(),
)

CORS_ALLOW_CREDENTIALS = True


# DRF & JWT
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
    "DEFAULT_RENDERER_CLASSES": (
        "rest_framework.renderers.JSONRenderer",
    ),
    "EXCEPTION_HANDLER": "core.utils.custom_exception_handler",
}

SIMPLE_JWT = {
    # Token lifetimes
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),  # Short-lived access token
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),     # Longer-lived refresh token
    
    # Security: Rotate refresh tokens on each use
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    
    # Authentication header
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    
    # Token claims
    "TOKEN_TYPE_CLAIM": "token_type",
    "JTI_CLAIM": "jti",
    
    # Algorithms
    "ALGORITHM": "HS256",
    
    # Signing key (uses SECRET_KEY by default, which is correct for HS256)
}


# Frontend and email helpers used by core views
FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:3000")
DEFAULT_FROM_EMAIL = config(
    "DEFAULT_FROM_EMAIL",
    default="noreply@hostelnepal.local",
)

EMAIL_BACKEND = config(
    "EMAIL_BACKEND",
    default="django.core.mail.backends.console.EmailBackend",
)


# Third-party integrations
STRIPE_SECRET_KEY = config("STRIPE_SECRET_KEY", default="")
STRIPE_NPR_PER_USD = config("STRIPE_NPR_PER_USD", default=147.28, cast=float)

# eSewa (ePay v2)
ESEWA_PRODUCT_CODE = config("ESEWA_PRODUCT_CODE", default="EPAYTEST")
ESEWA_SECRET_KEY = config(
    "ESEWA_SECRET_KEY",
    default="8gBm/:&EnhH.1/q" if DEBUG else "",
)
ESEWA_FORM_URL = config(
    "ESEWA_FORM_URL",
    default="https://rc-epay.esewa.com.np/api/epay/main/v2/form",
)
ESEWA_STATUS_URL = config(
    "ESEWA_STATUS_URL",
    default="https://rc.esewa.com.np/api/epay/transaction/status/",
)


# ════════════════════════════════════════════════════════════════
# SECURITY CONFIGURATION (Production-Ready)
# ════════════════════════════════════════════════════════════════

# HTTPS & Secure Cookies
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

# Security headers (via middleware)
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_SECURITY_POLICY = {
    "default-src": ("'self'",),
    "script-src": ("'self'", "cdn.jsdelivr.net"),
    "style-src": ("'self'", "'unsafe-inline'", "cdn.jsdelivr.net"),
    "img-src": ("'self'", "data:", "https:"),
    "font-src": ("'self'", "data:", "cdn.jsdelivr.net"),
    "connect-src": ("'self'", "https://"),
}

# Session security
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Strict"
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = "Strict"

# JWT Cookie settings (for future use with secure cookies)
JWT_COOKIE_SECURE = not DEBUG
JWT_COOKIE_HTTPONLY = True
JWT_COOKIE_SAMESITE = "Strict"

