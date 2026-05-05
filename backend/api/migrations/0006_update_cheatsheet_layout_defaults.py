from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_cheatsheet_spacing"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cheatsheet",
            name="columns",
            field=models.IntegerField(default=4),
        ),
        migrations.AlterField(
            model_name="cheatsheet",
            name="font_size",
            field=models.CharField(default="9pt", max_length=10),
        ),
        migrations.AlterField(
            model_name="cheatsheet",
            name="margins",
            field=models.CharField(default="0.15in", max_length=20),
        ),
        migrations.AlterField(
            model_name="cheatsheet",
            name="spacing",
            field=models.CharField(default="small", max_length=10),
        ),
    ]
