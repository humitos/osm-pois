from poi.models import POI
from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin


admin.site.register(POI, LeafletGeoAdmin)
