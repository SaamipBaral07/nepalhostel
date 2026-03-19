"""
नेपाल Hostel Finder — API Views

Response conventions
────────────────────
• Single object / non-paginated list → { data: T, message?: string }
• Paginated list                     → DRF default: { count, next, previous, results }
"""

import base64
import hashlib
import hmac
import json
import uuid
from decimal import Decimal, ROUND_HALF_UP
from urllib.parse import urlencode
from urllib.request import urlopen

import stripe
from django.conf import settings as django_settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.db.models import Q
from django.http import HttpResponseRedirect
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Booking,
    ChatbotQA,
    ChatbotUserQuery,
    City,
    ContactEnquiry,
    Hostel,
    HostelImage,
    Payment,
    Review,
    SiteSetting,
    SitePage,
    SocialLink,
    Wishlist,
)
from .permissions import IsHost, IsHostOwner
from .serializers import (
    BookingCreateSerializer,
    BookingSerializer,
    BookingUserSerializer,
    ChatbotQASerializer,
    ChatbotUserQueryCreateSerializer,
    ChatbotUserQuerySerializer,
    CitySerializer,
    ContactEnquirySerializer,
    ForgotPasswordSerializer,
    GoogleLoginSerializer,
    HostelDetailSerializer,
    HostelSummarySerializer,
    LoginSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    ReviewCreateSerializer,
    ReviewSerializer,
    SiteSettingSerializer,
    SitePageSerializer,
    SocialLinkSerializer,
    UserSerializer,
    WishlistSerializer,
    WishlistToggleSerializer,
)


# ───────────────────────────────────────────────────────
# Helpers
# ───────────────────────────────────────────────────────


def api_response(data, message=None, status_code=status.HTTP_200_OK):
    """Wrap *data* in the ``{ data, message? }`` envelope the frontend expects."""
    body = {"data": data}
    if message:
        body["message"] = message
    return Response(body, status=status_code)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


# ═══════════════════════════════════════════════════════
# Auth
# ═══════════════════════════════════════════════════════


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return api_response(
            {
                "user": UserSerializer(user, context={"request": request}).data,
                "tokens": get_tokens_for_user(user),
            },
            message="Registration successful.",
            status_code=status.HTTP_201_CREATED,
        )


class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        return api_response(
            {
                "user": UserSerializer(user, context={"request": request}).data,
                "tokens": get_tokens_for_user(user),
            },
        )


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return api_response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        serializer = self.get_serializer(
            request.user, data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Optionally blacklist the refresh token; always returns 204."""
    try:
        refresh = request.data.get("refresh")
        if refresh:
            token = RefreshToken(refresh)
            token.blacklist()
    except Exception:
        pass
    return Response(status=status.HTTP_204_NO_CONTENT)


# ═══════════════════════════════════════════════════════
# Google OAuth
# ═══════════════════════════════════════════════════════


class GoogleLoginView(generics.GenericAPIView):
    """
    POST /auth/google/
    Accepts a Google access token (credential), fetches user info
    from Google, and returns JWT tokens + user data.
    Creates the user on first login.
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = GoogleLoginSerializer

    def post(self, request, *args, **kwargs):
        import requests as http_requests

        from .models import User

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        access_token = serializer.validated_data["credential"]

        # Verify the access token with Google's userinfo endpoint
        try:
            resp = http_requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=10,
            )
            if resp.status_code != 200:
                return api_response(
                    None,
                    message="Invalid Google token.",
                    status_code=status.HTTP_401_UNAUTHORIZED,
                )
            idinfo = resp.json()
        except http_requests.RequestException:
            return api_response(
                None,
                message="Could not verify Google token.",
                status_code=status.HTTP_502_BAD_GATEWAY,
            )

        email = idinfo.get("email")
        if not email or not idinfo.get("email_verified"):
            return api_response(
                None,
                message="Google account email is not verified.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        # Find or create user
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                email=email,
                full_name=idinfo.get("name", email.split("@")[0]),
                role="user",
            )

        if not user.is_active:
            return api_response(
                None,
                message="This account has been disabled.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        return api_response(
            {
                "user": UserSerializer(user, context={"request": request}).data,
                "tokens": get_tokens_for_user(user),
            },
            message="Google login successful.",
        )


# ═══════════════════════════════════════════════════════
# Password Reset
# ═══════════════════════════════════════════════════════


class ForgotPasswordView(generics.GenericAPIView):
    """
    POST /auth/forgot-password/
    Sends a password-reset email with a tokenised link.
    Always returns 200 to prevent email enumeration.
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = ForgotPasswordSerializer

    def post(self, request, *args, **kwargs):
        from .models import User

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        # Always respond with the same message to prevent email enumeration
        success_msg = (
            "If an account with that email exists, "
            "a password reset link has been sent."
        )

        try:
            user = User.objects.get(email__iexact=email, is_active=True)
        except User.DoesNotExist:
            return api_response(None, message=success_msg)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = (
            f"{django_settings.FRONTEND_URL}/reset-password"
            f"?uid={uid}&token={token}"
        )

        send_mail(
            subject="Reset your Hostel Nepal password",
            message=(
                f"Hi {user.full_name},\n\n"
                f"Click the link below to reset your password:\n"
                f"{reset_url}\n\n"
                f"This link expires in 24 hours.\n\n"
                f"If you did not request this, please ignore this email."
            ),
            from_email=django_settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return api_response(None, message=success_msg)


class ResetPasswordView(generics.GenericAPIView):
    """
    POST /auth/reset-password/
    Accepts uid, token, and new password. Resets the password.
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = ResetPasswordSerializer

    def post(self, request, *args, **kwargs):
        from .models import User

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data["uid"]))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return api_response(
                None,
                message="Invalid or expired reset link.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(
            user, serializer.validated_data["token"]
        ):
            return api_response(
                None,
                message="Invalid or expired reset link.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["password"])
        user.save()

        return api_response(
            None,
            message="Password has been reset successfully. You can now log in.",
        )


# ═══════════════════════════════════════════════════════
# Cities
# ═══════════════════════════════════════════════════════


class CityListView(generics.ListAPIView):
    """GET /cities/ — public list of active cities."""

    permission_classes = [permissions.AllowAny]
    serializer_class = CitySerializer
    pagination_class = None

    def get_queryset(self):
        return City.objects.filter(is_active=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(serializer.data)


# ═══════════════════════════════════════════════════════
# Hostels
# ═══════════════════════════════════════════════════════


class HostelViewSet(viewsets.ViewSet):
    """
    Manually-routed hostel endpoints so we get full control over which
    HTTP methods each URL accepts (the frontend's ``upload`` helper always
    sends POST, even for updates).
    """

    def get_permissions(self):
        if self.action in ("list", "retrieve", "featured", "cities", "amenities", "nearby"):
            return [permissions.AllowAny()]
        if self.action in ("create", "my_listings"):
            return [permissions.IsAuthenticated(), IsHost()]
        if self.action in ("update", "destroy"):
            return [permissions.IsAuthenticated(), IsHostOwner()]
        return [permissions.IsAuthenticated()]

    # ----------------------------------------------------------
    # Helpers
    # ----------------------------------------------------------

    def _resolve_hostel(self, lookup, qs=None):
        """Find a hostel by UUID *or* slug."""
        if qs is None:
            qs = Hostel.objects.filter(is_active=True, is_approved=True)
        try:
            uuid.UUID(str(lookup))
            return qs.get(pk=lookup)
        except (ValueError, TypeError):
            pass
        try:
            return qs.get(slug=lookup)
        except Hostel.DoesNotExist:
            raise NotFound("Hostel not found.")

    def _apply_filters(self, qs, params):
        if city := params.get("city"):
            qs = qs.filter(city__iexact=city)
        if gc := params.get("genderCategory"):
            qs = qs.filter(gender_category=gc)
        
        # Price filters (monthly)
        if min_p := params.get("minPrice"):
            qs = qs.filter(price_per_month__gte=min_p)
        if max_p := params.get("maxPrice"):
            qs = qs.filter(price_per_month__lte=max_p)
        
        # Bed count filters
        if min_beds := params.get("minBeds"):
            qs = qs.filter(total_beds__gte=min_beds)
        if max_beds := params.get("maxBeds"):
            qs = qs.filter(total_beds__lte=max_beds)
        
        # Amenities filter (JSON field - SQLite compatible)
        if amenities := params.get("amenities"):
            amenity_list = amenities.split(",")
            for amenity in amenity_list:
                amenity_clean = amenity.strip()
                # Use raw SQL for SQLite JSON compatibility
                # This checks if the amenity exists in the JSON array
                qs = qs.extra(
                    where=[
                        "EXISTS (SELECT 1 FROM json_each(core_hostel.amenities) WHERE value = %s)"
                    ],
                    params=[amenity_clean]
                )
        
        # Search filter
        if search := params.get("search"):
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(city__icontains=search)
                | Q(description__icontains=search)
            )
        
        # Ordering
        order_map = {
            "pricePerNight": "price_per_night",
            "-pricePerNight": "-price_per_night",
            "pricePerMonth": "price_per_month",
            "-pricePerMonth": "-price_per_month",
            "name": "name",
            "-name": "-name",
            "createdAt": "created_at",
            "-createdAt": "-created_at",
        }
        if ordering := params.get("ordering"):
            if mapped := order_map.get(ordering):
                qs = qs.order_by(mapped)
        return qs

    # ----------------------------------------------------------
    # Public
    # ----------------------------------------------------------

    def list(self, request):
        """GET /hostels/ — paginated list with optional filters."""
        qs = self._apply_filters(
            Hostel.objects.filter(is_active=True, is_approved=True), request.query_params
        )
        from rest_framework.pagination import PageNumberPagination

        paginator = PageNumberPagination()
        paginator.page_size = 12
        page = paginator.paginate_queryset(qs, request)
        serializer = HostelSummarySerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, lookup=None):
        """GET /hostels/<slug-or-uuid>/"""
        hostel = self._resolve_hostel(lookup)
        serializer = HostelDetailSerializer(
            hostel, context={"request": request}
        )
        return api_response(serializer.data)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        """GET /hostels/featured/"""
        qs = Hostel.objects.filter(is_active=True, is_approved=True, is_featured=True)[:8]
        serializer = HostelSummarySerializer(
            qs, many=True, context={"request": request}
        )
        return api_response(serializer.data)

    @action(detail=False, methods=["get"])
    def cities(self, request):
        """GET /hostels/cities/"""
        cities = (
            Hostel.objects.filter(is_active=True, is_approved=True)
            .values_list("city", flat=True)
            .distinct()
            .order_by("city")
        )
        return api_response(list(cities))

    @action(detail=False, methods=["get"])
    def amenities(self, request):
        """GET /hostels/amenities/ — Get all unique amenities from active hostels."""
        from django.db.models import JSONField
        
        # Get all hostels with amenities
        hostels = Hostel.objects.filter(is_active=True, is_approved=True).exclude(amenities=[])
        
        # Collect all unique amenities
        amenities_set = set()
        for hostel in hostels:
            if hostel.amenities:
                for amenity in hostel.amenities:
                    if amenity:  # Skip empty strings
                        amenities_set.add(amenity.strip())
        
        # Return sorted list
        return api_response(sorted(list(amenities_set)))

    @action(detail=False, methods=["get"])
    def nearby(self, request):
        """GET /hostels/nearby/?lat=...&lng=...&radius=...

        Returns hostels within *radius* km of the given point,
        sorted by distance (closest first). Uses the Haversine formula.
        """
        import math

        try:
            user_lat = float(request.query_params["lat"])
            user_lng = float(request.query_params["lng"])
        except (KeyError, ValueError, TypeError):
            return Response(
                {"message": "lat and lng query params are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        radius_km = float(request.query_params.get("radius", 25))

        qs = Hostel.objects.filter(
            is_active=True,
            is_approved=True,
            latitude__isnull=False,
            longitude__isnull=False,
        )

        results = []
        for hostel in qs:
            lat1 = math.radians(user_lat)
            lat2 = math.radians(float(hostel.latitude))
            dlat = math.radians(float(hostel.latitude) - user_lat)
            dlng = math.radians(float(hostel.longitude) - user_lng)

            a = (
                math.sin(dlat / 2) ** 2
                + math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2
            )
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            distance_km = 6371 * c  # Earth radius in km

            if distance_km <= radius_km:
                results.append((distance_km, hostel))

        results.sort(key=lambda x: x[0])

        hostels_data = []
        for distance_km, hostel in results:
            data = HostelSummarySerializer(
                hostel, context={"request": request}
            ).data
            data["distance"] = round(distance_km, 2)
            hostels_data.append(data)

        return api_response(hostels_data)

    # ----------------------------------------------------------
    # Host CRUD
    # ----------------------------------------------------------

    @action(detail=False, methods=["get"], url_path="my-listings")
    def my_listings(self, request):
        """GET /hostels/my-listings/"""
        qs = Hostel.objects.filter(host=request.user)
        from rest_framework.pagination import PageNumberPagination

        paginator = PageNumberPagination()
        paginator.page_size = 12
        page = paginator.paginate_queryset(qs, request)
        serializer = HostelSummarySerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)

    def create(self, request):
        """POST /hostels/ — FormData with images."""
        data = request.data
        hostel = Hostel.objects.create(
            host=request.user,
            name=data.get("name", ""),
            description=data.get("description", ""),
            city=data.get("city", ""),
            address=data.get("address", ""),
            gender_category=data.get("genderCategory", ""),
            price_per_night=data.get("pricePerNight", 0),
            price_per_month=data.get("pricePerMonth", 0),
            total_beds=data.get("totalBeds", 0),
            available_beds=data.get("totalBeds", 0),
            amenities=(
                data.getlist("amenities")
                if hasattr(data, "getlist")
                else data.get("amenities", [])
            ),
            latitude=data.get("latitude") or None,
            longitude=data.get("longitude") or None,
        )
        for i, img in enumerate(request.FILES.getlist("images")):
            HostelImage.objects.create(
                hostel=hostel, image=img, is_primary=(i == 0)
            )
        serializer = HostelDetailSerializer(
            hostel, context={"request": request}
        )
        return api_response(
            serializer.data, status_code=status.HTTP_201_CREATED
        )

    def update(self, request, lookup=None):
        """POST|PUT /hostels/<uuid>/ — FormData update."""
        qs = Hostel.objects.filter(host=request.user)
        hostel = self._resolve_hostel(lookup, qs=qs)
        self.check_object_permissions(request, hostel)

        data = request.data
        hostel.name = data.get("name", hostel.name)
        hostel.description = data.get("description", hostel.description)
        hostel.city = data.get("city", hostel.city)
        hostel.address = data.get("address", hostel.address)
        hostel.gender_category = data.get(
            "genderCategory", hostel.gender_category
        )
        hostel.price_per_night = data.get(
            "pricePerNight", hostel.price_per_night
        )
        hostel.price_per_month = data.get(
            "pricePerMonth", hostel.price_per_month
        )
        hostel.total_beds = data.get("totalBeds", hostel.total_beds)
        if data.get("latitude"):
            hostel.latitude = data.get("latitude")
        if data.get("longitude"):
            hostel.longitude = data.get("longitude")
        if hasattr(data, "getlist"):
            amenities = data.getlist("amenities")
            if amenities:
                hostel.amenities = amenities
        hostel.save()

        images = request.FILES.getlist("images")
        if images:
            hostel.images.all().delete()
            for i, img in enumerate(images):
                HostelImage.objects.create(
                    hostel=hostel, image=img, is_primary=(i == 0)
                )

        serializer = HostelDetailSerializer(
            hostel, context={"request": request}
        )
        return api_response(serializer.data)

    def destroy(self, request, lookup=None):
        """DELETE /hostels/<uuid>/ — soft-delete."""
        qs = Hostel.objects.filter(host=request.user)
        hostel = self._resolve_hostel(lookup, qs=qs)
        self.check_object_permissions(request, hostel)
        hostel.is_active = False
        hostel.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ═══════════════════════════════════════════════════════
# Reviews (nested under /hostels/<id>/reviews/)
# ═══════════════════════════════════════════════════════


class ReviewListCreateView(generics.ListCreateAPIView):
    def get_queryset(self):
        return Review.objects.filter(hostel_id=self.kwargs["hostel_id"])

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ReviewCreateSerializer
        return ReviewSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def _user_can_review(self, user, hostel):
        """User can review only if they have a confirmed/completed booking
        whose check-out date has passed (i.e. they actually stayed there)."""
        today = timezone.now().date()
        return Booking.objects.filter(
            user=user,
            hostel=hostel,
            status__in=("confirmed", "completed"),
            check_out__lte=today,
        ).exists()

    def create(self, request, *args, **kwargs):
        hostel_id = self.kwargs["hostel_id"]
        try:
            hostel = Hostel.objects.get(pk=hostel_id)
        except Hostel.DoesNotExist:
            raise NotFound("Hostel not found.")

        if Review.objects.filter(hostel=hostel, user=request.user).exists():
            return Response(
                {"message": "You have already reviewed this hostel."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not self._user_can_review(request.user, hostel):
            return Response(
                {"message": "You can only review a hostel after your stay is complete."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save(hostel=hostel, user=request.user)
        return api_response(
            ReviewSerializer(review, context={"request": request}).data,
            status_code=status.HTTP_201_CREATED,
        )


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def review_eligibility(request, hostel_id):
    """GET /hostels/<uuid>/reviews/eligibility/ — check if user can review."""
    try:
        hostel = Hostel.objects.get(pk=hostel_id)
    except Hostel.DoesNotExist:
        raise NotFound("Hostel not found.")

    already_reviewed = Review.objects.filter(
        hostel=hostel, user=request.user
    ).exists()

    today = timezone.now().date()
    has_qualifying_booking = Booking.objects.filter(
        user=request.user,
        hostel=hostel,
        status__in=("confirmed", "completed"),
        check_out__lte=today,
    ).exists()

    return api_response({
        "canReview": has_qualifying_booking and not already_reviewed,
        "alreadyReviewed": already_reviewed,
        "hasCompletedStay": has_qualifying_booking,
    })


# ═══════════════════════════════════════════════════════
# Bookings
# ═══════════════════════════════════════════════════════


class BookingViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    # ----------------------------------------------------------
    # User bookings
    # ----------------------------------------------------------

    def list(self, request):
        """GET /bookings/ — current user's bookings (paginated)."""
        qs = (
            Booking.objects.filter(user=request.user)
            .exclude(status="cancelled")
            .exclude(payment_status="unpaid")
        )
        from rest_framework.pagination import PageNumberPagination

        paginator = PageNumberPagination()
        paginator.page_size = 12
        page = paginator.paginate_queryset(qs, request)
        serializer = BookingSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)

    def retrieve(self, request, pk=None):
        """GET /bookings/<uuid>/"""
        try:
            booking = Booking.objects.get(
                pk=pk,
            )
        except Booking.DoesNotExist:
            raise NotFound("Booking not found.")
        # Allow the booking user or the hostel host to view
        if booking.user != request.user and booking.hostel.host != request.user:
            raise NotFound("Booking not found.")
        serializer = BookingSerializer(
            booking, context={"request": request}
        )
        return api_response(serializer.data)

    def create(self, request):
        """POST /bookings/"""
        # Hosts cannot book hostels
        if request.user.role in ("host", "admin"):
            return Response(
                {"message": "Hosts cannot create bookings. Use a guest account."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = BookingCreateSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return api_response(
            BookingSerializer(booking, context={"request": request}).data,
            status_code=status.HTTP_201_CREATED,
        )

    # ----------------------------------------------------------
    # Cancel
    # ----------------------------------------------------------

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        """POST /bookings/<uuid>/cancel/"""
        try:
            booking = Booking.objects.get(pk=pk, user=request.user)
        except Booking.DoesNotExist:
            raise NotFound("Booking not found.")
        if booking.status not in ("pending", "confirmed"):
            return Response(
                {"message": "Cannot cancel this booking."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        booking.status = "cancelled"
        booking.save()
        return api_response(
            BookingSerializer(booking, context={"request": request}).data
        )

    # ----------------------------------------------------------
    # Host
    # ----------------------------------------------------------

    @action(detail=False, methods=["get"], url_path="host-requests")
    def host_requests(self, request):
        """GET /bookings/host-requests/ — bookings for this host's hostels."""
        qs = Booking.objects.filter(hostel__host=request.user)
        from rest_framework.pagination import PageNumberPagination

        paginator = PageNumberPagination()
        paginator.page_size = 12
        page = paginator.paginate_queryset(qs, request)
        serializer = BookingSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)

    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        """PATCH /bookings/<uuid>/status/"""
        try:
            booking = Booking.objects.get(pk=pk, hostel__host=request.user)
        except Booking.DoesNotExist:
            raise NotFound("Booking not found.")
        new_status = request.data.get("status")
        if new_status not in ("confirmed", "cancelled", "completed"):
            return Response(
                {"message": "Invalid status."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        booking.status = new_status
        booking.save()
        return api_response(
            BookingSerializer(booking, context={"request": request}).data
        )


# ═══════════════════════════════════════════════════════
# Payments
# ═══════════════════════════════════════════════════════

stripe.api_key = django_settings.STRIPE_SECRET_KEY


def _resolve_stripe_amount(amount_npr: Decimal) -> tuple[str, int]:
    """Convert NPR booking amount into USD cents for Stripe checkout."""

    npr_per_usd = Decimal(str(getattr(django_settings, "STRIPE_NPR_PER_USD", 147.28)))
    if npr_per_usd <= 0:
        npr_per_usd = Decimal("147.28")
    usd_amount = (amount_npr / npr_per_usd).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return "usd", int((usd_amount * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def _mark_payment_completed(payment: Payment, transaction_id: str):
    """Finalize payment and sync booking payment status."""
    if payment.status != "completed":
        payment.status = "completed"
        payment.paid_at = timezone.now()
    payment.transaction_id = transaction_id or payment.transaction_id
    payment.save()

    booking = payment.booking
    booking.payment_status = (
        "fully_paid" if payment.amount >= booking.total_amount else "advance_paid"
    )
    booking.save()


def _esewa_signature(message: str, secret_key: str) -> str:
    digest = hmac.new(
        secret_key.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return base64.b64encode(digest).decode("utf-8")


def _esewa_verify_status(product_code: str, total_amount: str, transaction_uuid: str) -> bool:
    """Confirm transaction completion with eSewa status API."""
    status_url = getattr(django_settings, "ESEWA_STATUS_URL", "").strip()
    if not status_url:
        return False

    query = urlencode(
        {
            "product_code": product_code,
            "total_amount": total_amount,
            "transaction_uuid": transaction_uuid,
        }
    )
    url = f"{status_url}?{query}"
    with urlopen(url, timeout=15) as response:
        payload = json.loads(response.read().decode("utf-8"))
    return str(payload.get("status", "")).upper() == "COMPLETE"


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_checkout_session(request, pk):
    """POST /payments/<booking_uuid>/checkout/ — create a Stripe Checkout Session."""
    try:
        booking = Booking.objects.get(pk=pk, user=request.user)
    except Booking.DoesNotExist:
        raise NotFound("Booking not found.")

    if booking.payment_status == "fully_paid":
        return Response(
            {"message": "This booking is already fully paid."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    payment = booking.payments.filter(status="pending").first()
    if not payment:
        return Response(
            {"message": "No pending payment found for this booking."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    stripe_currency, stripe_unit_amount = _resolve_stripe_amount(payment.amount)
    payment.method = "stripe"
    payment.save(update_fields=["method"])

    frontend_url = django_settings.FRONTEND_URL

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": stripe_currency,
                        "product_data": {
                            "name": f"Booking — {booking.hostel.name}",
                            "description": (
                                f"{booking.get_stay_type_display()} stay: "
                                f"{booking.check_in} → {booking.check_out}"
                            ),
                        },
                        "unit_amount": stripe_unit_amount,
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=(
                f"{frontend_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
                f"&booking_id={booking.id}"
            ),
            cancel_url=f"{frontend_url}/checkout/cancel?booking_id={booking.id}",
            metadata={
                "booking_id": str(booking.id),
                "payment_id": str(payment.id),
                "currency": stripe_currency,
            },
        )
    except stripe.error.StripeError as e:
        return Response(
            {"message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return api_response(
        {
            "checkoutUrl": session.url,
            "sessionId": session.id,
        }
    )


@csrf_exempt
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def stripe_webhook(request):
    """POST /payments/webhook/stripe/ — handle Stripe webhook events."""
    payload = request.body
    # Parse webhook event directly without signature verification
    import json

    try:
        event = stripe.Event.construct_from(
            json.loads(payload), stripe.api_key
        )
    except (ValueError, json.JSONDecodeError):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        payment_id = session.get("metadata", {}).get("payment_id")
        booking_id = session.get("metadata", {}).get("booking_id")

        if payment_id:
            try:
                payment = Payment.objects.get(pk=payment_id)
                _mark_payment_completed(payment, session.get("payment_intent", ""))
            except Payment.DoesNotExist:
                pass

    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_esewa_payment(request, pk):
    """POST /payments/<booking_uuid>/esewa/ — create signed eSewa form payload."""
    try:
        booking = Booking.objects.get(pk=pk, user=request.user)
    except Booking.DoesNotExist:
        raise NotFound("Booking not found.")

    if booking.payment_status == "fully_paid":
        return Response(
            {"message": "This booking is already fully paid."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    payment = booking.payments.filter(status="pending").first()
    if not payment:
        return Response(
            {"message": "No pending payment found for this booking."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    product_code = getattr(django_settings, "ESEWA_PRODUCT_CODE", "").strip()
    secret_key = getattr(django_settings, "ESEWA_SECRET_KEY", "").strip()
    form_url = getattr(django_settings, "ESEWA_FORM_URL", "").strip()
    if not product_code or not secret_key or not form_url:
        return Response(
            {"message": "eSewa is not configured. Please contact support."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    total_amount = str(payment.amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
    transaction_uuid = f"{booking.id}-{uuid.uuid4().hex[:8]}"
    signed_field_names = "total_amount,transaction_uuid,product_code"
    message = (
        f"total_amount={total_amount},"
        f"transaction_uuid={transaction_uuid},"
        f"product_code={product_code}"
    )
    signature = _esewa_signature(message, secret_key)

    payment.method = "esewa"
    payment.transaction_id = transaction_uuid
    payment.save(update_fields=["method", "transaction_id"])

    success_url = request.build_absolute_uri("/api/v1/payments/esewa/success/")
    failure_url = (
        f"{django_settings.FRONTEND_URL}/checkout/cancel"
        f"?booking_id={booking.id}&gateway=esewa"
    )

    return api_response(
        {
            "formUrl": form_url,
            "formData": {
                "amount": total_amount,
                "tax_amount": "0",
                "total_amount": total_amount,
                "transaction_uuid": transaction_uuid,
                "product_code": product_code,
                "product_service_charge": "0",
                "product_delivery_charge": "0",
                "success_url": success_url,
                "failure_url": failure_url,
                "signed_field_names": signed_field_names,
                "signature": signature,
            },
        }
    )


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def esewa_success(request):
    """GET /payments/esewa/success/ — verify eSewa response and redirect frontend."""
    frontend_url = getattr(django_settings, "FRONTEND_URL", "http://localhost:3000")
    fallback_redirect = f"{frontend_url}/checkout/cancel?gateway=esewa"

    encoded_data = request.query_params.get("data")
    if not encoded_data:
        return HttpResponseRedirect(fallback_redirect)

    try:
        padded = encoded_data + "=" * (-len(encoded_data) % 4)
        decoded_data = base64.b64decode(padded).decode("utf-8")
        esewa_payload = json.loads(decoded_data)
    except (ValueError, json.JSONDecodeError):
        return HttpResponseRedirect(fallback_redirect)

    transaction_uuid = str(esewa_payload.get("transaction_uuid", "")).strip()
    total_amount = str(esewa_payload.get("total_amount", "")).strip()
    product_code = str(esewa_payload.get("product_code", "")).strip()
    status_text = str(esewa_payload.get("status", "")).upper()
    signed_field_names = str(esewa_payload.get("signed_field_names", "")).strip()
    received_signature = str(esewa_payload.get("signature", "")).strip()

    if not transaction_uuid or not total_amount or not product_code:
        return HttpResponseRedirect(fallback_redirect)

    secret_key = getattr(django_settings, "ESEWA_SECRET_KEY", "").strip()
    if secret_key and signed_field_names and received_signature:
        fields = [name.strip() for name in signed_field_names.split(",") if name.strip()]
        verification_message = ",".join(
            f"{field}={esewa_payload.get(field, '')}" for field in fields
        )
        expected_signature = _esewa_signature(verification_message, secret_key)
        if not hmac.compare_digest(expected_signature, received_signature):
            return HttpResponseRedirect(fallback_redirect)

    try:
        payment = Payment.objects.select_related("booking").get(
            transaction_id=transaction_uuid,
            method="esewa",
            status="pending",
        )
    except Payment.DoesNotExist:
        return HttpResponseRedirect(fallback_redirect)

    booking_id = payment.booking.id
    failed_redirect = f"{frontend_url}/checkout/cancel?booking_id={booking_id}&gateway=esewa"

    if status_text != "COMPLETE":
        return HttpResponseRedirect(failed_redirect)

    try:
        is_valid = _esewa_verify_status(product_code, total_amount, transaction_uuid)
    except Exception:
        return HttpResponseRedirect(failed_redirect)

    if not is_valid:
        return HttpResponseRedirect(failed_redirect)

    _mark_payment_completed(payment, transaction_uuid)
    return HttpResponseRedirect(
        f"{frontend_url}/checkout/success?booking_id={booking_id}&gateway=esewa"
    )


# ═══════════════════════════════════════════════════════
# Contact Enquiry
# ═══════════════════════════════════════════════════════


class ContactEnquiryView(generics.CreateAPIView):
    """POST /contact/ — submit a contact enquiry (public)."""

    permission_classes = [permissions.AllowAny]
    serializer_class = ContactEnquirySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return api_response(
            serializer.data,
            message="Your enquiry has been submitted successfully. We'll get back to you soon!",
            status_code=status.HTTP_201_CREATED,
        )


# ═══════════════════════════════════════════════════════
# Wishlist
# ═══════════════════════════════════════════════════════


class WishlistViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        """GET /wishlist/ — current user's wishlisted hostels."""
        qs = Wishlist.objects.filter(user=request.user).select_related("hostel")
        serializer = WishlistSerializer(
            qs, many=True, context={"request": request}
        )
        return api_response(serializer.data)

    @action(detail=False, methods=["post"])
    def toggle(self, request):
        """POST /wishlist/toggle/ — add or remove a hostel from wishlist."""
        serializer = WishlistToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hostel_id = serializer.validated_data["hostelId"]
        hostel = Hostel.objects.get(pk=hostel_id)

        existing = Wishlist.objects.filter(user=request.user, hostel=hostel).first()
        if existing:
            existing.delete()
            return api_response(
                {"wishlisted": False},
                message="Removed from wishlist.",
            )
        else:
            Wishlist.objects.create(user=request.user, hostel=hostel)
            return api_response(
                {"wishlisted": True},
                message="Added to wishlist.",
                status_code=status.HTTP_201_CREATED,
            )

    @action(detail=False, methods=["get"])
    def check(self, request):
        """GET /wishlist/check/?hostelId=... — check if a hostel is wishlisted."""
        hostel_id = request.query_params.get("hostelId")
        if not hostel_id:
            return Response(
                {"message": "hostelId query param is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        wishlisted = Wishlist.objects.filter(
            user=request.user, hostel_id=hostel_id
        ).exists()
        return api_response({"wishlisted": wishlisted})

    @action(detail=False, methods=["get"])
    def ids(self, request):
        """GET /wishlist/ids/ — return list of wishlisted hostel IDs."""
        hostel_ids = list(
            Wishlist.objects.filter(user=request.user)
            .values_list("hostel_id", flat=True)
        )
        return api_response(hostel_ids)


# ═══════════════════════════════════════════════════════
# Site Pages (About, etc.)
# ═══════════════════════════════════════════════════════


class SitePageDetailView(generics.RetrieveAPIView):
    """GET /pages/<slug>/ — retrieve a site page by slug."""

    permission_classes = [permissions.AllowAny]
    serializer_class = SitePageSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return SitePage.objects.filter(is_active=True)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(serializer.data)


class SiteSettingListView(generics.ListAPIView):
    """GET /site-settings/ — public active key/value settings."""

    permission_classes = [permissions.AllowAny]
    serializer_class = SiteSettingSerializer
    pagination_class = None

    def get_queryset(self):
        return SiteSetting.objects.filter(is_active=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        settings_map = {
            item["key"]: item["value"] for item in serializer.data
        }
        return api_response(settings_map)


# ═══════════════════════════════════════════════════════
# Social Links
# ═══════════════════════════════════════════════════════


class SocialLinkListView(generics.ListAPIView):
    """GET /social-links/ — public list of active social media links."""

    permission_classes = [permissions.AllowAny]
    serializer_class = SocialLinkSerializer
    pagination_class = None

    def get_queryset(self):
        return SocialLink.objects.filter(is_active=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(serializer.data)


# ═══════════════════════════════════════════════════════
# Chatbot Q&A
# ═══════════════════════════════════════════════════════


class ChatbotQAListView(generics.ListAPIView):
    """GET /chatbot/questions/ — public list of active chatbot Q&As."""

    permission_classes = [permissions.AllowAny]
    serializer_class = ChatbotQASerializer
    pagination_class = None

    def get_queryset(self):
        return ChatbotQA.objects.filter(is_active=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(serializer.data)


class ChatbotUserQueryCreateView(generics.CreateAPIView):
    """POST /chatbot/query/ — submit an unsupported query for staff follow-up."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChatbotUserQueryCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        query = serializer.save()
        response_data = ChatbotUserQuerySerializer(query).data
        return api_response(
            response_data,
            message="Thanks for your question. Our team will review it and reply here.",
            status_code=status.HTTP_201_CREATED,
        )


class MyChatbotQueryListView(generics.ListAPIView):
    """GET /chatbot/my-queries/ — current user's submitted queries and replies."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChatbotUserQuerySerializer
    pagination_class = None

    def get_queryset(self):
        qs = ChatbotUserQuery.objects.filter(user=self.request.user).order_by("-created_at")
        only_replied = self.request.query_params.get("onlyReplied", "").lower()
        if only_replied in ("1", "true", "yes"):
            qs = qs.exclude(admin_reply="").filter(reply_seen=False)
        return qs

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return api_response(serializer.data)


@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def mark_chatbot_reply_as_seen(request, pk):
    """PATCH /chatbot/mark-seen/<uuid>/ — mark a reply as seen."""
    try:
        query = ChatbotUserQuery.objects.get(pk=pk, user=request.user)
    except ChatbotUserQuery.DoesNotExist:
        raise NotFound("Query not found.")

    query.reply_seen = True
    query.save()
    return api_response(ChatbotUserQuerySerializer(query).data)
