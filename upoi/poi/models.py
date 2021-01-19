from django.db import models

class Poi(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.CharField(max_length=50)
    website = models.CharField(max_length=150)
    # TODO: use PointField to save coordinates
    # coordinates = models.PointField()
    coordinates = models.CharField(max_length=100)
    social_media = models.CharField(max_length=300)


    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=100)
    pois = models.ManyToManyField('Poi', through='Layer')


    def __str__(self):
        return self.name


class Layer(models.Model):
    poi = models.ForeignKey('Poi', on_delete=models.CASCADE)
    tag = models.ForeignKey('Tag', on_delete=models.CASCADE)
