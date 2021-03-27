from django.shortcuts import render
from django.urls import reverse
from django.views import View
from .models import Poi

def index(request):
    # return render(request, 'poi/index.html')
    all_poi_list = Poi.objects.all()
    context = {'all_poi_list': all_poi_list}
    return render(request, 'poi/index.html', context)
