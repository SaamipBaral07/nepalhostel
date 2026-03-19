"""
Security headers middleware for production-ready authentication.
Adds security headers to prevent XSS, clickjacking, and other attacks.
"""


class SecurityHeadersMiddleware:
    """Add security headers to all responses."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Prevent clickjacking attacks
        response["X-Frame-Options"] = "DENY"

        # Prevent MIME type sniffing
        response["X-Content-Type-Options"] = "nosniff"

        # Enable XSS filter in older browsers
        response["X-XSS-Protection"] = "1; mode=block"

        # Referrer policy (don't send referrer to external sites)
        response["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Feature policy / Permissions policy
        response["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(), "
            "payment=(), usb=(), magnetometer=(), "
            "gyroscope=(), accelerometer=()"
        )

        # Prevent caching of sensitive data
        if request.path.startswith("/auth/"):
            response["Cache-Control"] = "no-cache, no-store, must-revalidate, private"
            response["Pragma"] = "no-cache"
            response["Expires"] = "0"

        return response
