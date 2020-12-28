from django.shortcuts import render
from django.urls import reverse
from django.views import View

def index(request):
    return render(request, 'poi/index.html')
