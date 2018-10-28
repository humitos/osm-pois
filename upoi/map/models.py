from django.db import models


class User(models.Model):
    user = models.CharField(max_length=20)
    name = models.CharField(max_length=20)
    lastname = models.CharField(max_length=20)
    email = models.EmailField(max_length=50)
    layer = models.ManyToManyField('Layer',
        related_name='users_layers'
    )
    favorite_layers = models.ManyToManyField(
        'Layer',
        related_name='users_favorite_layers',
    )


class TypeOfPoint(models.Model):
    pass


class Background(models.Model):
    pass


class Link(models.Model):
    pass


class Point(models.Model):
    latitude = models.DecimalField(
        decimal_places=2,
        max_digits=10
    )
    longitude = models.DecimalField(
        decimal_places=2,
        max_digits=10
    )
    type_of_poi = models.ManyToManyField(TypeOfPoint)
    expires_at = models.DateField()
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)


class Layer(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='layers_users'
    )
    collaborators = models.ManyToManyField(
        User,
        related_name='layers_collaborators',
    )
    private = models.BooleanField()
    shared_with = models.ManyToManyField(
        User,
        related_name='shared_with'
    )
    shared_by_link = models.BooleanField()
    link_to_share = models.ForeignKey(Link, on_delete=models.CASCADE)
    points = models.ManyToManyField(Point)
    center = models.ForeignKey(
        Point,
        on_delete=models.CASCADE,
        related_name='center_of_map'
    )
    background = models.ManyToManyField(Background)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
