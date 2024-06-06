# Generated by Django 5.0.6 on 2024-06-05 23:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profiles", "0014_rename_istrain_task_is_train_alter_task_status"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="task",
            name="is_train",
        ),
        migrations.CreateModel(
            name="Training",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("task_id", models.CharField(max_length=255)),
                (
                    "dataset",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="trainer",
                        to="profiles.dataset",
                    ),
                ),
            ],
        ),
    ]
