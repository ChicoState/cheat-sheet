from django.db import migrations, models


def backfill_content_source(apps, schema_editor):
    CheatSheet = apps.get_model("api", "CheatSheet")
    for sheet in CheatSheet.objects.all():
        if not (sheet.latex_content or "").strip():
            sheet.content_source = "empty"
        else:
            sheet.content_source = "manual"
        sheet.save(update_fields=["content_source"])


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_update_cheatsheet_layout_defaults"),
    ]

    operations = [
        migrations.AddField(
            model_name="cheatsheet",
            name="content_source",
            field=models.CharField(
                choices=[
                    ("empty", "Empty"),
                    ("generated", "Generated"),
                    ("manual", "Manual"),
                ],
                default="empty",
                max_length=20,
            ),
        ),
        migrations.RunPython(backfill_content_source, migrations.RunPython.noop),
    ]
