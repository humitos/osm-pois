from django.conf.urls import url
from djgeojson.views import GeoJSONLayerView
from poi.models import POI


urlpatterns = [
    url(r'^data.geojson$', GeoJSONLayerView.as_view(model=POI, geometry_field='location'), name='data'),
]
