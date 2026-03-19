"""
नेपाल Hostel Finder — URL configuration for the ``core`` app.

All paths are mounted under /api/v1/ by the project-level config/urls.py.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────
    path("auth/register/", views.RegisterView.as_view(), name="register"),
    path("auth/login/", views.LoginView.as_view(), name="login"),
    path("auth/google/", views.GoogleLoginView.as_view(), name="google-login"),
    path("auth/forgot-password/", views.ForgotPasswordView.as_view(), name="forgot-password"),
    path("auth/reset-password/", views.ResetPasswordView.as_view(), name="reset-password"),
    path("auth/profile/", views.ProfileView.as_view(), name="profile"),
    path(
        "auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
    path("auth/logout/", views.logout_view, name="logout"),
    # ── Cities ────────────────────────────────────────────────
    path("cities/", views.CityListView.as_view(), name="city-list"),
    # ── Hostels (named actions BEFORE the catch-all <lookup>) ─
    path(
        "hostels/",
        views.HostelViewSet.as_view({"get": "list", "post": "create"}),
        name="hostel-list",
    ),
    path(
        "hostels/featured/",
        views.HostelViewSet.as_view({"get": "featured"}),
        name="hostel-featured",
    ),
    path(
        "hostels/my-listings/",
        views.HostelViewSet.as_view({"get": "my_listings"}),
        name="hostel-my-listings",
    ),
    path(
        "hostels/cities/",
        views.HostelViewSet.as_view({"get": "cities"}),
        name="hostel-cities",
    ),
    path(
        "hostels/amenities/",
        views.HostelViewSet.as_view({"get": "amenities"}),
        name="hostel-amenities",
    ),
    path(
        "hostels/nearby/",
        views.HostelViewSet.as_view({"get": "nearby"}),
        name="hostel-nearby",
    ),
    # Reviews nested under a hostel (UUID only)
    path(
        "hostels/<uuid:hostel_id>/reviews/",
        views.ReviewListCreateView.as_view(),
        name="hostel-reviews",
    ),
    path(
        "hostels/<uuid:hostel_id>/reviews/eligibility/",
        views.review_eligibility,
        name="hostel-review-eligibility",
    ),
    # Hostel detail — accepts slug *or* UUID.
    # POST is mapped to update because the frontend's ``upload`` helper
    # always sends POST even for updates.
    path(
        "hostels/<str:lookup>/",
        views.HostelViewSet.as_view(
            {
                "get": "retrieve",
                "post": "update",
                "put": "update",
                "patch": "update",
                "delete": "destroy",
            }
        ),
        name="hostel-detail",
    ),
    # ── Bookings ──────────────────────────────────────────────
    path(
        "bookings/",
        views.BookingViewSet.as_view({"get": "list", "post": "create"}),
        name="booking-list",
    ),
    path(
        "bookings/host-requests/",
        views.BookingViewSet.as_view({"get": "host_requests"}),
        name="booking-host-requests",
    ),
    path(
        "bookings/<uuid:pk>/",
        views.BookingViewSet.as_view({"get": "retrieve"}),
        name="booking-detail",
    ),
    path(
        "bookings/<uuid:pk>/cancel/",
        views.BookingViewSet.as_view({"post": "cancel"}),
        name="booking-cancel",
    ),
    path(
        "bookings/<uuid:pk>/status/",
        views.BookingViewSet.as_view({"patch": "update_status"}),
        name="booking-status",
    ),
    # ── Payments ──────────────────────────────────────────────
    path(
        "payments/<uuid:pk>/checkout/",
        views.create_checkout_session,
        name="payment-checkout",
    ),
    path(
        "payments/webhook/stripe/",
        views.stripe_webhook,
        name="stripe-webhook",
    ),
    # Alias for stripe CLI's default forward path
    path(
        "payments/stripe/webhook/",
        views.stripe_webhook,
        name="stripe-webhook-alias",
    ),
    path(
        "payments/<uuid:pk>/esewa/",
        views.create_esewa_payment,
        name="esewa-initiate",
    ),
    path(
        "payments/esewa/success/",
        views.esewa_success,
        name="esewa-success",
    ),
    # ── Contact ───────────────────────────────────────────────
    path(
        "contact/",
        views.ContactEnquiryView.as_view(),
        name="contact-enquiry",
    ),
    # ── Wishlist ──────────────────────────────────────────────
    path(
        "wishlist/",
        views.WishlistViewSet.as_view({"get": "list"}),
        name="wishlist-list",
    ),
    path(
        "wishlist/toggle/",
        views.WishlistViewSet.as_view({"post": "toggle"}),
        name="wishlist-toggle",
    ),
    path(
        "wishlist/check/",
        views.WishlistViewSet.as_view({"get": "check"}),
        name="wishlist-check",
    ),
    path(
        "wishlist/ids/",
        views.WishlistViewSet.as_view({"get": "ids"}),
        name="wishlist-ids",
    ),
    # ── Site Pages (About, etc.) ──────────────────────────────
    path(
        "pages/<slug:slug>/",
        views.SitePageDetailView.as_view(),
        name="site-page-detail",
    ),
    path(
        "site-settings/",
        views.SiteSettingListView.as_view(),
        name="site-settings-list",
    ),
    # ── Social Links ───────────────────────────────────────────
    path(
        "social-links/",
        views.SocialLinkListView.as_view(),
        name="social-link-list",
    ),
    # ── Chatbot ────────────────────────────────────────────────
    path(
        "chatbot/questions/",
        views.ChatbotQAListView.as_view(),
        name="chatbot-qa-list",
    ),
    path(
        "chatbot/query/",
        views.ChatbotUserQueryCreateView.as_view(),
        name="chatbot-query-create",
    ),
    path(
        "chatbot/my-queries/",
        views.MyChatbotQueryListView.as_view(),
        name="chatbot-query-list",
    ),
    path(
        "chatbot/mark-seen/<uuid:pk>/",
        views.mark_chatbot_reply_as_seen,
        name="chatbot-mark-seen",
    ),
]
