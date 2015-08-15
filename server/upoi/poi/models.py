from django.contrib.gis.db import models
from django.utils.translation import ugettext as _


class POI(models.Model):
    # Regular POI added by some user. It may matchs with another POI
    # already added to the OpenStreetMap official db.

    name = models.CharField(max_length=127, null=True, blank=True)
    amenity = models.ForeignKey('Amenity', null=True, blank=True)
    shop = models.ForeignKey('Shop', null=True, blank=True)
    addr_street = models.CharField(max_length=127, null=True, blank=True)
    addr_housenumber = models.CharField(max_length=15, null=True, blank=True)  # 143 Bis
    location = models.PointField()

    objects = models.GeoManager()

    # contact_email
    # contact_phone
    # contact_website
    # contact_facebook
    # contact_twitter

    def __str__(self):
        return self.name or self.amenity or self.shop or str(self.location.coords)


class Amenity(models.Model):
    AMENITY_CHOICES = (
        ('restaurant', _('Restaurant')),
        ('fast_food', _('Fast Food')),
        ('atm', _('At the moment')),
    )

    name = models.CharField(max_length=15, choices=AMENITY_CHOICES)


class Shop(models.Model):
    SHOP_CHOICES = (
        ('car_repair', 'Car Repair'),
    )

    name = models.CharField(max_length=15, choices=SHOP_CHOICES)
