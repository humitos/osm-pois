from django.db import models
from django.contrib.gis.db import models


class Poi(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.CharField(max_length=50)
    website = models.CharField(max_length=150)
    coordinates = models.PointField()
    social_media = models.CharField(max_length=300)