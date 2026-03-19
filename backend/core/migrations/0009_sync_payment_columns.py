from django.db import migrations, models


def add_missing_payment_columns(apps, schema_editor):
    table_name = "core_payment"

    with schema_editor.connection.cursor() as cursor:
        table_description = schema_editor.connection.introspection.get_table_description(
            cursor, table_name
        )
        existing_columns = {col.name for col in table_description}

        statements = [
            (
                "stripe_refund_id",
                "ALTER TABLE core_payment ADD COLUMN stripe_refund_id varchar(255) NOT NULL DEFAULT ''",
            ),
            (
                "refunded_at",
                "ALTER TABLE core_payment ADD COLUMN refunded_at datetime NULL",
            ),
        ]

        for column_name, sql in statements:
            if column_name not in existing_columns:
                schema_editor.execute(sql)


def noop_reverse(apps, schema_editor):
    # Intentionally no-op to avoid destructive schema operations.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0008_sync_booking_columns"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(add_missing_payment_columns, noop_reverse),
            ],
            state_operations=[
                migrations.AddField(
                    model_name="payment",
                    name="stripe_refund_id",
                    field=models.CharField(blank=True, default="", max_length=255),
                ),
                migrations.AddField(
                    model_name="payment",
                    name="refunded_at",
                    field=models.DateTimeField(blank=True, null=True),
                ),
            ],
        ),
    ]
