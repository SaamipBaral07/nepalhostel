"""
Custom DRF permissions for नेपाल Hostel Finder.
"""

from rest_framework import permissions


class IsHost(permissions.BasePermission):
    """Allow access only to users with role=host or role=admin."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in (
            "host",
            "admin",
        )


class IsHostOwner(permissions.BasePermission):
    """Allow only the hostel owner (or admin) to modify."""

    def has_object_permission(self, request, view, obj):
        return obj.host == request.user or request.user.role == "admin"
