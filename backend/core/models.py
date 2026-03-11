"""
नेपाल Hostel Finder — Django Models
"""

import uuid

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify


# ══════════════════════════════════════════════════════════════
# User
# ══════════════════════════════════════════════════════════════


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("user", "User"),
        ("host", "Host"),
        ("admin", "Admin"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, default="")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="user")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.email


# ══════════════════════════════════════════════════════════════
# City
# ══════════════════════════════════════════════════════════════


class City(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    tagline = models.CharField(max_length=200, blank=True, default="")
    image = models.ImageField(upload_to="cities/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    ordering = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["ordering", "name"]
        verbose_name_plural = "cities"

    def __str__(self):
        return self.name


# ══════════════════════════════════════════════════════════════
# Hostel
# ══════════════════════════════════════════════════════════════


class Hostel(models.Model):
    GENDER_CHOICES = [
        ("boys", "Boys"),
        ("girls", "Girls"),
        ("unisex", "Unisex"),
        ("tourist", "Tourist"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="hostels")
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=300, blank=True)
    description = models.TextField()
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=500)
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    gender_category = models.CharField(max_length=10, choices=GENDER_CHOICES)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    total_beds = models.PositiveIntegerField()
    available_beds = models.PositiveIntegerField()
    amenities = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            slug = base
            counter = 1
            while Hostel.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    # ------------------------------------------------------------------
    # Computed properties consumed by serializers
    # ------------------------------------------------------------------

    @property
    def rating(self):
        avg = self.reviews.aggregate(models.Avg("rating"))["rating__avg"]
        return round(avg, 1) if avg else 0

    @property
    def review_count(self):
        return self.reviews.count()

    def __str__(self):
        return self.name


class HostelImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hostel = models.ForeignKey(
        Hostel, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="hostels/")
    alt_text = models.CharField(max_length=255, blank=True, default="")
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_primary", "created_at"]

    def __str__(self):
        return f"{self.hostel.name} — image"


# ══════════════════════════════════════════════════════════════
# Booking
# ══════════════════════════════════════════════════════════════


class Booking(models.Model):
    STAY_TYPE_CHOICES = [
        ("short", "Short Stay"),
        ("long", "Long Stay"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]
    PAYMENT_STATUS_CHOICES = [
        ("unpaid", "Unpaid"),
        ("advance_paid", "Advance Paid"),
        ("fully_paid", "Fully Paid"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hostel = models.ForeignKey(
        Hostel, on_delete=models.CASCADE, related_name="bookings"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bookings"
    )
    stay_type = models.CharField(max_length=10, choices=STAY_TYPE_CHOICES)
    check_in = models.DateField()
    check_out = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    advance_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    status = models.CharField(
        max_length=15, choices=STATUS_CHOICES, default="pending"
    )
    payment_status = models.CharField(
        max_length=15, choices=PAYMENT_STATUS_CHOICES, default="unpaid"
    )
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} → {self.hostel.name}"


# ══════════════════════════════════════════════════════════════
# Payment
# ══════════════════════════════════════════════════════════════


class Payment(models.Model):
    METHOD_CHOICES = [
        ("esewa", "eSewa"),
        ("stripe", "Stripe"),
        ("offline", "Offline"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(
        Booking, on_delete=models.CASCADE, related_name="payments"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    status = models.CharField(
        max_length=15, choices=STATUS_CHOICES, default="pending"
    )
    transaction_id = models.CharField(max_length=255, blank=True, default="")
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} — {self.booking}"


# ══════════════════════════════════════════════════════════════
# Review
# ══════════════════════════════════════════════════════════════


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hostel = models.ForeignKey(
        Hostel, on_delete=models.CASCADE, related_name="reviews"
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reviews"
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["hostel", "user"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} — {self.hostel.name} ({self.rating}★)"


# ══════════════════════════════════════════════════════════════
# Contact Enquiry
# ══════════════════════════════════════════════════════════════


class ContactEnquiry(models.Model):
    SUBJECT_CHOICES = [
        ("general", "General Inquiry"),
        ("booking", "Booking Issue"),
        ("listing", "Listing / Host Support"),
        ("feedback", "Feedback"),
        ("partnership", "Partnership"),
        ("other", "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, default="")
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, default="general")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    admin_notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact Enquiry"
        verbose_name_plural = "Contact Enquiries"

    def __str__(self):
        return f"{self.name} — {self.get_subject_display()}"


# ══════════════════════════════════════════════════════════════
# Wishlist
# ══════════════════════════════════════════════════════════════


class Wishlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="wishlists"
    )
    hostel = models.ForeignKey(
        Hostel, on_delete=models.CASCADE, related_name="wishlisted_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "hostel"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} ♥ {self.hostel.name}"


# ══════════════════════════════════════════════════════════════
# Site Page  (dynamic "About", etc. — editable from admin)
# ══════════════════════════════════════════════════════════════


class SitePage(models.Model):
    """
    A single-instance-per-slug CMS-lite model.
    Use slug="about" for the About page content.
    All fields are editable from the Django admin panel.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True, max_length=100)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=500, blank=True, default="")
    body = models.TextField(blank=True, default="", help_text="Main page content (supports markdown/HTML)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["slug"]

    def __str__(self):
        return self.title


class SitePageSection(models.Model):
    """Repeatable content blocks within a SitePage (team members, features, stats, etc.)."""

    SECTION_TYPE_CHOICES = [
        ("stat", "Statistic"),
        ("feature", "Feature"),
        ("team", "Team Member"),
        ("value", "Core Value"),
        ("faq", "FAQ"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(
        SitePage, on_delete=models.CASCADE, related_name="sections"
    )
    section_type = models.CharField(max_length=20, choices=SECTION_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=500, blank=True, default="")
    body = models.TextField(blank=True, default="")
    icon = models.CharField(max_length=50, blank=True, default="", help_text="Lucide icon name, e.g. 'Shield', 'Heart'")
    image = models.ImageField(upload_to="pages/", blank=True, null=True)
    ordering = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["ordering", "created_at"]

    def __str__(self):
        return f"{self.page.title} — {self.get_section_type_display()}: {self.title}"
