# Generated by Django 5.1.1 on 2025-06-25 08:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_alter_orderitem_order"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="order",
            name="quantity",
        ),
    ]
