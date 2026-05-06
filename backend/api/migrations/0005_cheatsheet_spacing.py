from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_cheatsheet_user_nonnull"),
    ]

    operations = [
        migrations.AddField(
            model_name="cheatsheet",
            name="spacing",
            field=models.CharField(default="large", max_length=10),
        ),
    ]
