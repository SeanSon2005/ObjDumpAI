# Generated by Django 5.0.6 on 2024-06-06 21:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profiles", "0019_task_completed_at"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="task",
            name="completed_at",
        ),
        migrations.AddField(
            model_name="training",
            name="completed_at",
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
