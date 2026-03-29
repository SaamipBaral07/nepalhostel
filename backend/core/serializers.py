"""
नेपाल Hostel Finder — DRF Serializers

Every serializer outputs **camelCase** keys to match the Next.js frontend
TypeScript interfaces defined in lib/types/index.ts.
"""

from django.conf import settings as django_settings
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import (
    Booking,
    ChatbotQA,
    ChatbotUserQuery,
    City,
    ContactEnquiry,
    EmailVerification,
    Hostel,
    HostelImage,
    Payment,
    Review,
    SiteSetting,
    SitePage,
    SitePageSection,
    SocialLink,
    User,
    Wishlist,
)


def _absolute_url(request, file_field):
    """Return an absolute URL for a file field, with SITE_URL fallback."""
    if request:
        return request.build_absolute_uri(file_field.url)
    return f"{django_settings.SITE_URL}{file_field.url}"


# ═══════════════════════════════════════════════════════════════
# City serializers
# ═══════════════════════════════════════════════════════════════


class CitySerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    isActive = serializers.BooleanField(source="is_active", read_only=True)

    class Meta:
        model = City
        fields = ["id", "name", "tagline", "imageUrl", "isActive", "ordering", "createdAt"]

    def get_imageUrl(self, obj):  # noqa: N802
        if obj.image:
            return _absolute_url(self.context.get("request"), obj.image)
        return None


# ═══════════════════════════════════════════════════════════════
# User serializers
# ═══════════════════════════════════════════════════════════════


class UserSerializer(serializers.ModelSerializer):
    """Full user representation (profile, auth responses)."""

    fullName = serializers.CharField(source="full_name")
    avatarUrl = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "fullName",
            "phone",
            "role",
            "avatarUrl",
            "createdAt",
        ]
        read_only_fields = ["id", "email", "createdAt"]

    def get_avatarUrl(self, obj):  # noqa: N802
        if obj.avatar:
            return _absolute_url(self.context.get("request"), obj.avatar)
        return None


class UserMinSerializer(serializers.ModelSerializer):
    """Minimal user for nesting inside hostel / review."""

    fullName = serializers.CharField(source="full_name", read_only=True)
    avatarUrl = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "fullName", "avatarUrl"]

    def get_avatarUrl(self, obj):  # noqa: N802
        if obj.avatar:
            return _absolute_url(self.context.get("request"), obj.avatar)
        return None


class BookingUserSerializer(serializers.ModelSerializer):
    """User subset embedded in booking responses."""

    fullName = serializers.CharField(source="full_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "fullName", "email", "phone"]


# ═══════════════════════════════════════════════════════════════
# Auth serializers
# ═══════════════════════════════════════════════════════════════


class RegisterSerializer(serializers.Serializer):
    fullName = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    password = serializers.CharField(min_length=8, write_only=True)
    confirmPassword = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=["user", "host"])
    avatar = serializers.ImageField(required=False, allow_null=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        verification = EmailVerification.objects.filter(
            email__iexact=value
        ).first()
        if not verification or not verification.is_verified:
            raise serializers.ValidationError(
                "Email is not verified. Please verify your email before registering."
            )
        return value

    def validate(self, data):
        if data["password"] != data["confirmPassword"]:
            raise serializers.ValidationError(
                {"confirmPassword": "Passwords do not match."}
            )
        return data

    def create(self, validated_data):
        validated_data.pop("confirmPassword")
        avatar = validated_data.pop("avatar", None)
        
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data["fullName"],
            phone=validated_data.get("phone", ""),
            role=validated_data["role"],
        )
        
        if avatar:
            user.avatar = avatar
            user.save()

        # Consume successful verification so a new registration requires a new OTP.
        EmailVerification.objects.filter(email__iexact=user.email).delete()
        
        return user


class EmailVerificationRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value


class EmailVerificationConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.RegexField(r"^\d{6}$")


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(
            request=self.context.get("request"),
            email=data["email"],
            password=data["password"],
        )
        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled.")
        data["user"] = user
        return data


class GoogleLoginSerializer(serializers.Serializer):
    credential = serializers.CharField()


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(min_length=8)

    def validate_password(self, value):
        validate_password(value)
        return value


# ═══════════════════════════════════════════════════════════════
# Hostel serializers
# ═══════════════════════════════════════════════════════════════


class HostelImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    altText = serializers.CharField(
        source="alt_text", required=False, allow_blank=True
    )
    isPrimary = serializers.BooleanField(source="is_primary")

    class Meta:
        model = HostelImage
        fields = ["id", "url", "altText", "isPrimary"]

    def get_url(self, obj):
        return _absolute_url(self.context.get("request"), obj.image)


class HostelDetailSerializer(serializers.ModelSerializer):
    """Full hostel — for single-hostel API responses."""

    slug = serializers.SlugField(read_only=True)
    genderCategory = serializers.CharField(source="gender_category")
    pricePerNight = serializers.DecimalField(
        source="price_per_night", max_digits=10, decimal_places=2
    )
    pricePerMonth = serializers.DecimalField(
        source="price_per_month", max_digits=10, decimal_places=2
    )
    totalBeds = serializers.IntegerField(source="total_beds")
    availableBeds = serializers.IntegerField(source="available_beds")
    amenities = serializers.SerializerMethodField()
    images = HostelImageSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    rating = serializers.FloatField(read_only=True)
    reviewCount = serializers.IntegerField(source="review_count", read_only=True)
    host = UserMinSerializer(read_only=True)
    isFeatured = serializers.BooleanField(source="is_featured", read_only=True)
    isActive = serializers.BooleanField(source="is_active", read_only=True)
    isApproved = serializers.BooleanField(source="is_approved", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Hostel
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "city",
            "address",
            "latitude",
            "longitude",
            "genderCategory",
            "pricePerNight",
            "pricePerMonth",
            "totalBeds",
            "availableBeds",
            "amenities",
            "images",
            "reviews",
            "rating",
            "reviewCount",
            "host",
            "isFeatured",
            "isActive",
            "isApproved",
            "createdAt",
        ]

    def get_amenities(self, obj):
        return [
            {"id": name.lower().replace(" ", "-"), "name": name}
            for name in (obj.amenities or [])
        ]

    def get_reviews(self, obj):
        from .serializers import ReviewSerializer

        reviews = obj.reviews.select_related("user").all()[:20]
        return ReviewSerializer(
            reviews, many=True, context=self.context
        ).data


class HostelSummarySerializer(serializers.ModelSerializer):
    """Lightweight hostel summary for list / search results."""

    genderCategory = serializers.CharField(
        source="gender_category", read_only=True
    )
    pricePerNight = serializers.DecimalField(
        source="price_per_night",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )
    pricePerMonth = serializers.DecimalField(
        source="price_per_month",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )
    availableBeds = serializers.IntegerField(
        source="available_beds", read_only=True
    )
    rating = serializers.FloatField(read_only=True)
    reviewCount = serializers.IntegerField(
        source="review_count", read_only=True
    )
    isFeatured = serializers.BooleanField(
        source="is_featured", read_only=True
    )
    isApproved = serializers.BooleanField(
        source="is_approved", read_only=True
    )
    primaryImage = serializers.SerializerMethodField()

    class Meta:
        model = Hostel
        fields = [
            "id",
            "name",
            "slug",
            "city",
            "address",
            "latitude",
            "longitude",
            "genderCategory",
            "pricePerNight",
            "pricePerMonth",
            "availableBeds",
            "rating",
            "reviewCount",
            "isFeatured",
            "isApproved",
            "primaryImage",
        ]

    def get_primaryImage(self, obj):  # noqa: N802
        primary = obj.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.images.first()
        if primary:
            return _absolute_url(self.context.get("request"), primary.image)
        return None


# ═══════════════════════════════════════════════════════════════
# Booking serializers
# ═══════════════════════════════════════════════════════════════


class BookingSerializer(serializers.ModelSerializer):
    """Read-only booking representation with nested hostel & user."""

    hostel = HostelSummarySerializer(read_only=True)
    user = BookingUserSerializer(read_only=True)
    stayType = serializers.CharField(source="stay_type", read_only=True)
    checkIn = serializers.DateField(source="check_in", read_only=True)
    checkOut = serializers.DateField(source="check_out", read_only=True)
    totalAmount = serializers.DecimalField(
        source="total_amount",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )
    advanceAmount = serializers.DecimalField(
        source="advance_amount",
        max_digits=10,
        decimal_places=2,
        read_only=True,
        allow_null=True,
    )
    paymentStatus = serializers.CharField(
        source="payment_status", read_only=True
    )
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "hostel",
            "user",
            "stayType",
            "checkIn",
            "checkOut",
            "totalAmount",
            "advanceAmount",
            "status",
            "paymentStatus",
            "createdAt",
        ]


class BookingCreateSerializer(serializers.Serializer):
    """Write serializer — accepts the shape sent by the frontend form."""

    hostelId = serializers.UUIDField()
    stayType = serializers.ChoiceField(choices=["short", "long"])
    checkIn = serializers.DateField()
    checkOut = serializers.DateField()

    def validate_hostelId(self, value):  # noqa: N802
        if not Hostel.objects.filter(pk=value, is_active=True).exists():
            raise serializers.ValidationError("Hostel not found.")
        return value

    def validate(self, data):
        if data["checkIn"] >= data["checkOut"]:
            raise serializers.ValidationError(
                {"checkOut": "Check-out must be after check-in."}
            )
        # Prevent booking your own hostel
        user = self.context["request"].user
        hostel = Hostel.objects.get(pk=data["hostelId"])
        if hostel.host == user:
            raise serializers.ValidationError(
                "You cannot book your own hostel."
            )
        return data

    def create(self, validated_data):
        hostel = Hostel.objects.get(pk=validated_data["hostelId"])
        user = self.context["request"].user

        days = (validated_data["checkOut"] - validated_data["checkIn"]).days
        if validated_data["stayType"] == "short":
            total = hostel.price_per_night * days
            advance = total  # full payment for short stays
        else:
            months = max(days / 30, 1)
            total = hostel.price_per_month * int(months)
            advance = hostel.price_per_month  # one month advance for long stays

        booking = Booking.objects.create(
            hostel=hostel,
            user=user,
            stay_type=validated_data["stayType"],
            check_in=validated_data["checkIn"],
            check_out=validated_data["checkOut"],
            total_amount=total,
            advance_amount=advance,
        )

        # Create a pending payment record for the advance/full amount
        Payment.objects.create(
            booking=booking,
            amount=advance,
            method="stripe",
            status="pending",
        )

        return booking


# ═══════════════════════════════════════════════════════════════
# Review serializers
# ═══════════════════════════════════════════════════════════════


class ReviewSerializer(serializers.ModelSerializer):
    """Read-only review with nested user."""

    hostelId = serializers.UUIDField(source="hostel_id", read_only=True)
    user = UserMinSerializer(read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "hostelId", "user", "rating", "comment", "createdAt"]


class ReviewCreateSerializer(serializers.Serializer):
    """Write serializer for posting a review."""

    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField()

    def create(self, validated_data):
        return Review.objects.create(**validated_data)


# ═══════════════════════════════════════════════════════════════
# Contact Enquiry serializers
# ═══════════════════════════════════════════════════════════════


class ContactEnquirySerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = ContactEnquiry
        fields = ["id", "name", "email", "phone", "subject", "message", "createdAt"]
        read_only_fields = ["id", "createdAt"]


# ═══════════════════════════════════════════════════════════════
# Wishlist serializers
# ═══════════════════════════════════════════════════════════════


class WishlistSerializer(serializers.ModelSerializer):
    hostel = HostelSummarySerializer(read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "hostel", "createdAt"]


class WishlistToggleSerializer(serializers.Serializer):
    hostelId = serializers.UUIDField()

    def validate_hostelId(self, value):  # noqa: N802
        if not Hostel.objects.filter(pk=value, is_active=True).exists():
            raise serializers.ValidationError("Hostel not found.")
        return value


# ═══════════════════════════════════════════════════════════════
# Site Page serializers (About page, etc.)
# ═══════════════════════════════════════════════════════════════


class SitePageSectionSerializer(serializers.ModelSerializer):
    sectionType = serializers.CharField(source="section_type", read_only=True)
    imageUrl = serializers.SerializerMethodField()
    isActive = serializers.BooleanField(source="is_active", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = SitePageSection
        fields = [
            "id", "sectionType", "title", "subtitle", "body",
            "icon", "imageUrl", "ordering", "isActive", "createdAt",
        ]

    def get_imageUrl(self, obj):  # noqa: N802
        if obj.image:
            return _absolute_url(self.context.get("request"), obj.image)
        return None


class SitePageSerializer(serializers.ModelSerializer):
    sections = serializers.SerializerMethodField()
    isActive = serializers.BooleanField(source="is_active", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = SitePage
        fields = [
            "id", "slug", "title", "subtitle", "body",
            "isActive", "sections", "createdAt", "updatedAt",
        ]

    def get_sections(self, obj):
        sections = obj.sections.filter(is_active=True)
        return SitePageSectionSerializer(
            sections, many=True, context=self.context
        ).data


# ═══════════════════════════════════════════════════════════════
# Social Link serializers
# ═══════════════════════════════════════════════════════════════


class SocialLinkSerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source="is_active", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = SocialLink
        fields = ["id", "platform", "url", "label", "isActive", "ordering", "createdAt"]


class SiteSettingSerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source="is_active", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = SiteSetting
        fields = [
            "key",
            "value",
            "category",
            "description",
            "ordering",
            "isActive",
            "createdAt",
            "updatedAt",
        ]


# ═══════════════════════════════════════════════════════════════
# Chatbot Q&A serializers
# ═══════════════════════════════════════════════════════════════


class ChatbotQASerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source="is_active", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = ChatbotQA
        fields = ["id", "question", "answer", "category", "isActive", "ordering", "createdAt", "updatedAt"]


class ChatbotUserQuerySerializer(serializers.ModelSerializer):
    adminReply = serializers.CharField(source="admin_reply", read_only=True)
    repliedAt = serializers.DateTimeField(source="replied_at", read_only=True)
    replySeen = serializers.BooleanField(source="reply_seen", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = ChatbotUserQuery
        fields = [
            "id",
            "question",
            "status",
            "adminReply",
            "repliedAt",
            "replySeen",
            "createdAt",
            "updatedAt",
        ]


class ChatbotUserQueryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotUserQuery
        fields = ["question"]

    def validate_question(self, value):
        question = value.strip()
        if len(question) < 3:
            raise serializers.ValidationError("Question is too short.")
        return question

    def create(self, validated_data):
        return ChatbotUserQuery.objects.create(
            user=self.context["request"].user,
            question=validated_data["question"],
        )
