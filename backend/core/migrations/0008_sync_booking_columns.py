from django.db import migrations, models


def add_missing_booking_columns(apps, schema_editor):
    table_name = "core_booking"

    with schema_editor.connection.cursor() as cursor:
        table_description = schema_editor.connection.introspection.get_table_description(
            cursor, table_name
        )
        existing_columns = {col.name for col in table_description}

        statements = [
            (
                "stripe_session_id",
                "ALTER TABLE core_booking ADD COLUMN stripe_session_id varchar(255) NOT NULL DEFAULT ''",
            ),
            (
                "stripe_payment_intent_id",
                "ALTER TABLE core_booking ADD COLUMN stripe_payment_intent_id varchar(255) NOT NULL DEFAULT ''",
            ),
            (
                "auto_accept_enabled",
                "ALTER TABLE core_booking ADD COLUMN auto_accept_enabled bool NOT NULL DEFAULT 0",
            ),
            (
                "availability_locked",
                "ALTER TABLE core_booking ADD COLUMN availability_locked bool NOT NULL DEFAULT 0",
            ),
        ]

        for column_name, sql in statements:
            if column_name not in existing_columns:
                schema_editor.execute(sql)


def noop_reverse(apps, schema_editor):
    # Intentionally no-op. Dropping columns is database-specific and can be destructive.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0007_hostel_is_approved"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(add_missing_booking_columns, noop_reverse),
            ],
            state_operations=[
                migrations.AddField(
                    model_name="booking",
                    name="stripe_session_id",
                    field=models.CharField(blank=True, default="", max_length=255),
                ),
                migrations.AddField(
                    model_name="booking",
                    name="stripe_payment_intent_id",
                    field=models.CharField(blank=True, default="", max_length=255),
                ),
                migrations.AddField(
                    model_name="booking",
                    name="auto_accept_enabled",
                    field=models.BooleanField(default=False),
                ),
                migrations.AddField(
                    model_name="booking",
                    name="availability_locked",
                    field=models.BooleanField(default=False),
                ),
            ],
        ),
    ]
