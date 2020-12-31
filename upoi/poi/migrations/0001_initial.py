# Generated by Django 3.1.4 on 2020-12-31 09:08

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Poi',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=200)),
                ('phone', models.CharField(max_length=20)),
                ('email', models.CharField(max_length=50)),
                ('website', models.CharField(max_length=150)),
                ('coordinates', models.CharField(max_length=100)),
                ('social_media', models.CharField(max_length=300)),
            ],
        ),
    ]
