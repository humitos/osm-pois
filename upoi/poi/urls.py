from django.urls import path

from . import views

app_name = 'poi'

urlpatterns = [
    path('', views.index, name='index'),
]
