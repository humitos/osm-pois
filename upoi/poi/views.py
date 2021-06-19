from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views import generic
from .models import Poi
from rest_framework import viewsets
from .serializers import PoiSerializer


class IndexView(generic.ListView):
    template_name = 'poi/index.html'
    context_object_name = 'all_pois_from_db'
        
    def get_queryset(self):
        """
        """      
        pois = Poi.objects.all()
        return pois


class PoiViewset(viewsets.ModelViewSet):
    queryset = Poi.objects.all()
    serializer_class = PoiSerializer
