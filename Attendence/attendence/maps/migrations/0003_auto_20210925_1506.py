# Generated by Django 3.2.7 on 2021-09-25 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maps', '0002_auto_20210925_1432'),
    ]

    operations = [
        migrations.CreateModel(
            name='Latitude',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lat', models.FloatField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='LatitudeForm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lat', models.FloatField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Longitude',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lon', models.FloatField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='LongitudeForm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lon', models.FloatField(max_length=20)),
            ],
        ),
        migrations.DeleteModel(
            name='coordenadas',
        ),
    ]
