from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views import generic
from .models import Poi


class IndexView(generic.ListView):
    template_name = 'poi/index.html'
    context_object_name = 'all_poi_list'
        
    def get_queryset(self):
        """
        """      
        pois = Poi.objects.all()
        return pois
