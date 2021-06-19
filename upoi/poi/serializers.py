from rest_framework import serializers

from .models import Poi

class PoiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poi
        fields = '__all__'
        # fields = (
        #     'id', 'name', 'address','phone', 'email', 'website', 'coordinates', 'social_media', 'tags'
        # )
