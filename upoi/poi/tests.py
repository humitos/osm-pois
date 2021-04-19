import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'upoi.settings')
import django
django.setup()
from django.test import TestCase
from django.urls import reverse

from .models import Poi


def create_poi(name):
    """
    Create a poi with the given `poi_name`.
    """
    return Poi.objects.create(name=name)

class PoiModelTests(TestCase):

    def test_all_pois_added_by_admin_are_displayed(self):
        """
        Checks that all pois added to database by admin user are displayed
        """
        poi_for_test = create_poi(name="El quiosco de Pepito")
        poi_for_test2 = create_poi(name="La mercería de Lola")
        response = self.client.get(reverse('poi:index'))
        self.assertContains(response, "El quiosco de Pepito")
        self.assertContains(response, "La mercería de Lola")
