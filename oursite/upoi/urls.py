from django.urls import path

from . import views

app_name = 'upoi'

urlpatterns = [
    path('', views.index, name='index'),
]
