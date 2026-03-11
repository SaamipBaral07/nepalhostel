"""
Seed script — creates sample hostels, a host user, and a guest user.

Run:  python manage.py shell < core/seed.py
"""

import os, django  # noqa: E401

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.models import Booking, Hostel, HostelImage, Review, User  # noqa: E402

# ── Users ──────────────────────────────────────────────────────

host, _ = User.objects.get_or_create(
    email="host@hostelnepal.com",
    defaults={
        "full_name": "Ram Sharma",
        "phone": "9841111111",
        "role": "host",
    },
)
if not host.has_usable_password():
    host.set_password("host1234")
    host.save()

guest, _ = User.objects.get_or_create(
    email="guest@hostelnepal.com",
    defaults={
        "full_name": "Sita Thapa",
        "phone": "9842222222",
        "role": "user",
    },
)
if not guest.has_usable_password():
    guest.set_password("guest1234")
    guest.save()

# ── Hostels ────────────────────────────────────────────────────

HOSTELS = [
    {
        "name": "Himalayan Student Hostel",
        "description": "A modern and clean hostel in the heart of Kathmandu, perfect for students. Fast Wi-Fi, shared kitchen, study rooms, and 24/7 security.",
        "city": "Kathmandu",
        "address": "Bagbazar, Kathmandu 44600",
        "gender_category": "boys",
        "price_per_night": 500,
        "price_per_month": 8000,
        "total_beds": 30,
        "available_beds": 12,
        "amenities": ["Wi-Fi", "Hot Water", "Laundry", "Kitchen", "CCTV", "Study Room"],
        "is_featured": True,
    },
    {
        "name": "Lakeside Traveler's Lodge",
        "description": "Budget-friendly hostel right by Phewa Lake in Pokhara. Perfect base for trekking and chill vibes.",
        "city": "Pokhara",
        "address": "Lakeside Rd, Pokhara 33700",
        "gender_category": "tourist",
        "price_per_night": 800,
        "price_per_month": 15000,
        "total_beds": 20,
        "available_beds": 8,
        "amenities": ["Wi-Fi", "Hot Water", "Rooftop", "Common Area", "Locker"],
        "is_featured": True,
    },
    {
        "name": "Patan Girls Hostel",
        "description": "Safe and comfortable girls-only hostel in historic Lalitpur. Close to Patan Durbar Square and art colleges.",
        "city": "Lalitpur",
        "address": "Mangalbazar, Lalitpur 44700",
        "gender_category": "girls",
        "price_per_night": 600,
        "price_per_month": 9000,
        "total_beds": 25,
        "available_beds": 10,
        "amenities": ["Wi-Fi", "Hot Water", "CCTV", "Kitchen", "Generator Backup", "Meal Included"],
        "is_featured": True,
    },
    {
        "name": "Bhaktapur Heritage Stay",
        "description": "Stay in a traditional Newari house converted into a cozy hostel. Experience authentic Bhaktapur culture.",
        "city": "Bhaktapur",
        "address": "Taumadhi Square, Bhaktapur 44800",
        "gender_category": "unisex",
        "price_per_night": 700,
        "price_per_month": 10000,
        "total_beds": 15,
        "available_beds": 5,
        "amenities": ["Wi-Fi", "Hot Water", "Common Area", "Rooftop"],
        "is_featured": False,
    },
    {
        "name": "Chitwan Jungle Hostel",
        "description": "Eco-friendly hostel near Chitwan National Park. Jungle safaris and wildlife adventures await!",
        "city": "Chitwan",
        "address": "Sauraha, Chitwan 44200",
        "gender_category": "tourist",
        "price_per_night": 900,
        "price_per_month": 12000,
        "total_beds": 18,
        "available_beds": 7,
        "amenities": ["Wi-Fi", "Parking", "Common Area", "Meal Included", "Generator Backup"],
        "is_featured": True,
    },
    {
        "name": "Kathmandu Central Hostel",
        "description": "Affordable unisex hostel right in Thamel, the tourist hub. Walking distance to Durbar Square and Garden of Dreams.",
        "city": "Kathmandu",
        "address": "Thamel, Kathmandu 44600",
        "gender_category": "unisex",
        "price_per_night": 450,
        "price_per_month": 7000,
        "total_beds": 40,
        "available_beds": 20,
        "amenities": ["Wi-Fi", "Hot Water", "Laundry", "Locker", "Common Area"],
        "is_featured": False,
    },
]

for data in HOSTELS:
    hostel, created = Hostel.objects.get_or_create(
        name=data["name"],
        defaults={**data, "host": host},
    )
    if created:
        print(f"  Created hostel: {hostel.name} ({hostel.slug})")
    else:
        print(f"  Hostel exists: {hostel.name}")

# ── Reviews ────────────────────────────────────────────────────

hostels = Hostel.objects.all()
if hostels.exists() and not Review.objects.exists():
    first = hostels.first()
    Review.objects.create(hostel=first, user=guest, rating=5, comment="Great place to stay! Clean rooms and friendly staff.")
    Review.objects.create(hostel=hostels.last(), user=guest, rating=4, comment="Good location, decent amenities.")
    print("  Created sample reviews")

print("\n✅  Seed complete!")
print(f"   Host login:  host@hostelnepal.com / host1234")
print(f"   Guest login: guest@hostelnepal.com / guest1234")
print(f"   Admin login: admin@hostelnepal.com / admin123")
