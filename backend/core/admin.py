from django.contrib import admin

from .models import (
    Booking,
    City,
    ContactEnquiry,
    Hostel,
    HostelImage,
    Payment,
    Review,
    SitePage,
    SitePageSection,
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
    ]
    list_filter = ["city", "gender_category", "is_featured", "is_active"]
    search_fields = ["name", "city"]
    prepopulated_fields = {"slug": ("name",)}


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
