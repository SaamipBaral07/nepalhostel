"""
Management command to seed or update Google Maps embed settings.

Run: python manage.py seed_map_settings
"""

from django.core.management.base import BaseCommand
from core.models import SiteSetting


class Command(BaseCommand):
    help = "Seed or update Google Maps embed settings for the contact page"

    def handle(self, *args, **options):
        new_map_embed_url = (
            "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d821.1464313514035"
            "!2d83.97619529706265!3d28.203942335830074!3m2!1i1024!2i768!4f13.1!3m3!1m2"
            "!1s0x399595a1ddb082e5%3A0xacfac249f506ab8b!2sProforma%20Digital%20Solution"
            "%20Pvt.Ltd!5e0!3m2!1sen!2snp!4v1773907930192!5m2!1sen!2snp"
        )

        # Create or update the map embed URL setting
        setting, created = SiteSetting.objects.update_or_create(
            key="contact.map.embed_url",
            defaults={
                "value": new_map_embed_url,
                "category": "contact",
                "description": "Google Maps embed URL for the contact page office location",
                "is_active": True,
                "ordering": 10,
            },
        )

        action = "Created" if created else "Updated"
        self.stdout.write(
            self.style.SUCCESS(
                f"✓ {action} contact.map.embed_url setting"
            )
        )

        # Ensure other contact settings exist
        contact_settings = [
            (
                "contact.map.title",
                "Office Location",
                "Title displayed above the office map",
            ),
            (
                "contact.map.city",
                "Pokhara, Nepal",
                "City name for the office location",
            ),
            (
                "contact.map.description",
                "Visit our support office in Pokhara.",
                "Description of the office location",
            ),
            (
                "contact.map.open_url",
                "https://maps.google.com/?q=Proforma%20Digital%20Solution%20Pvt.Ltd%20Pokhara",
                "URL to open in Google Maps",
            ),
        ]

        for key, default_value, description in contact_settings:
            setting, created = SiteSetting.objects.get_or_create(
                key=key,
                defaults={
                    "value": default_value,
                    "category": "contact",
                    "description": description,
                    "is_active": True,
                    "ordering": 15,
                },
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"✓ Created {key} setting")
                )

        self.stdout.write(
            self.style.SUCCESS(
                "\n✓ All map settings have been seeded successfully!"
            )
        )
