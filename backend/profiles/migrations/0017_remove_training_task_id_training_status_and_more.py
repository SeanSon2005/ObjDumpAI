# Generated by Django 5.0.6 on 2024-06-06 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profiles", "0016_training_keywords"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="training",
            name="task_id",
        ),
        migrations.AddField(
            model_name="training",
            name="status",
            field=models.CharField(default="PENDING", max_length=255),
        ),
        migrations.AlterField(
            model_name="task",
            name="status",
            field=models.CharField(default="PENDING", max_length=50),
        ),
    ]