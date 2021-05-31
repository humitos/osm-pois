from django.contrib import admin

from .models import Poi, Tag, Layer


class LayerInline(admin.TabularInline):
    model = Layer
    extra = 1

class PoiAdmin(admin.ModelAdmin):
    inlines = (LayerInline,)

class TagAdmin(admin.ModelAdmin):
    inlines = (LayerInline,)

admin.site.register(Poi, PoiAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Layer)
