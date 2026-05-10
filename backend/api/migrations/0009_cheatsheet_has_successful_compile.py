from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0008_cheatsheet_orientation"),
    ]

    operations = [
        migrations.AddField(
            model_name="cheatsheet",
            name="has_successful_compile",
            field=models.BooleanField(default=False),
        ),
    ]
