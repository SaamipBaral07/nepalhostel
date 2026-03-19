from django import forms
from django.contrib import admin
from django.db.models import TextField
from django.forms import Textarea

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
    SitePageSection,
    SocialLink,
    User,
    Wishlist,
)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ["name", "tagline", "ordering", "is_active", "created_at"]
    list_filter = ["is_active"]
    search_fields = ["name", "tagline"]
    list_editable = ["ordering", "is_active"]
    ordering = ["ordering", "name"]


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["email", "full_name", "role", "is_active", "created_at"]
    list_filter = ["role", "is_active"]
    search_fields = ["email", "full_name"]


@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "city",
        "host",
        "gender_category",
        "price_per_night",
        "is_featured",
        "is_active",
        "is_approved",
    ]
    list_filter = ["city", "gender_category", "is_featured", "is_active", "is_approved"]
    search_fields = ["name", "city"]
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ["is_approved", "is_featured", "is_active"]
    actions = ["approve_hostels", "reject_hostels"]

    @admin.action(description="Approve selected hostels (list on website)")
    def approve_hostels(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} hostel(s) approved and listed on the website.")

    @admin.action(description="Reject / un-approve selected hostels")
    def reject_hostels(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f"{updated} hostel(s) removed from public listing.")


@admin.register(HostelImage)
class HostelImageAdmin(admin.ModelAdmin):
    list_display = ["hostel", "is_primary"]
    list_filter = ["is_primary"]


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "hostel",
        "stay_type",
        "check_in",
        "check_out",
        "status",
        "payment_status",
    ]
    list_filter = ["status", "payment_status", "stay_type"]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["booking", "amount", "method", "status", "paid_at"]
    list_filter = ["method", "status"]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["user", "hostel", "rating", "created_at"]
    list_filter = ["rating"]


@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "subject", "is_read", "created_at"]
    list_filter = ["subject", "is_read", "created_at"]
    search_fields = ["name", "email", "message"]
    list_editable = ["is_read"]
    readonly_fields = ["name", "email", "phone", "subject", "message", "created_at"]
    fieldsets = (
        ("Enquiry Details", {
            "fields": ("name", "email", "phone", "subject", "message", "created_at"),
        }),
        ("Admin", {
            "fields": ("is_read", "admin_notes"),
        }),
    )


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ["user", "hostel", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__email", "hostel__name"]


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ["key", "category", "value_preview", "ordering", "is_active", "updated_at"]
    list_filter = ["category", "is_active"]
    list_editable = ["ordering", "is_active"]
    search_fields = ["key", "value", "description"]
    fieldsets = (
        ("Setting Details", {
            "fields": ("key", "category", "description"),
        }),
        ("Value (for long content like iframes, use textarea below)", {
            "fields": ("value",),
            "classes": ("wide",),
        }),
        ("Configuration", {
            "fields": ("ordering", "is_active"),
        }),
    )

    def value_preview(self, obj):
        """Display a truncated preview of the value."""
        preview = obj.value[:50] if obj.value else "(empty)"
        return preview + "..." if len(obj.value) > 50 else preview
    value_preview.short_description = "Value Preview"

    def get_form(self, request, obj=None, **kwargs):
        """Use a larger textarea for the value field."""
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['value'].widget = Textarea(attrs={
            'rows': 8,
            'cols': 100,
            'style': 'font-family: monospace; font-size: 12px;'
        })
        return form


class SitePageSectionInline(admin.TabularInline):
    model = SitePageSection
    extra = 1
    fields = ["section_type", "title", "subtitle", "body", "icon", "image", "ordering", "is_active"]


@admin.register(SitePage)
class SitePageAdmin(admin.ModelAdmin):
    list_display = ["title", "slug", "is_active", "updated_at"]
    list_filter = ["is_active"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [SitePageSectionInline]


@admin.register(SitePageSection)
class SitePageSectionAdmin(admin.ModelAdmin):
    list_display = ["page", "section_type", "title", "ordering", "is_active"]
    list_filter = ["section_type", "is_active", "page"]
    list_editable = ["ordering", "is_active"]


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ["platform", "url", "label", "ordering", "is_active", "created_at"]
    list_filter = ["platform", "is_active"]
    list_editable = ["ordering", "is_active"]
    search_fields = ["platform", "url", "label"]


@admin.register(ChatbotQA)
class ChatbotQAAdmin(admin.ModelAdmin):
    list_display = ["question", "category", "ordering", "is_active", "updated_at"]
    list_filter = ["category", "is_active"]
    list_editable = ["ordering", "is_active"]
    search_fields = ["question", "answer", "category"]


@admin.register(ChatbotUserQuery)
class ChatbotUserQueryAdmin(admin.ModelAdmin):
    list_display = ["user", "status", "created_at", "replied_at"]
    list_filter = ["status", "created_at", "replied_at"]
    search_fields = ["user__email", "question", "admin_reply"]
    readonly_fields = ["user", "question", "created_at", "updated_at", "replied_at"]
    fieldsets = (
        ("User Query", {"fields": ("user", "question", "created_at", "updated_at")}),
        ("Support Reply", {"fields": ("status", "admin_reply", "replied_at")}),
    )
