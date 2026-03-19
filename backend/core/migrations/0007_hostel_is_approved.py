from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0006_chatbotuserquery_reply_seen"),
    ]

    operations = [
        migrations.AddField(
            model_name="hostel",
            name="is_approved",
            field=models.BooleanField(
                default=False,
                help_text="Must be approved by admin before appearing in public listings.",
            ),
        ),
    ]
