from django.urls import path, include

from . import views
from .views import PoiViewset
from rest_framework import routers


router = routers.DefaultRouter()
router.register('pois', PoiViewset)

app_name = 'poi'

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('api/', include(router.urls)),
]
