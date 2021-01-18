## UPOI site migration to Django app
This is a shared project between [EllaQuímica](https://github.com/EllaQuimica) & [Elena C.](https://github.com/Elena-GHub)
It is part of our learning journey, with mentoring by the original author [humitos](https://elblogdehumitos.com).  
The aim is to bring the UPOI app, which is already up and running, to a more customisable solution for its users.  
### Tech setup
- Django 3.1.4
- Python 3.9
  
### How to set up the project

## Setup
The first thing to do is to clone the repository:

```sh
$ git clone https://github.com/humitos/osm-pois
$ cd osm-pois
```

Create a virtual environment to install dependencies in and activate it (in some systems it is run with ```python``` instead ```python3```):

```sh
$ python3 -m venv myvenv
$ source myvenv/bin/activate
```
```
(myvenv) $ python3 -m pip install --upgrade pip
(myvenv) $ pip install -r requirements.txt
(myvenv) $ python3 manage.py runserver
```

Then visit `http://localhost:8000` to view the app.
   ![Preview](docs/poi-landing-page.png)

#  From the original Readme:
# osm-pois 

Show POIs from OSM in a map

## Live version!

http://upoi.org

## Forked versions

 - http://www.konfraria.org/osm/cerca/web/
 - http://mapa.barriohacker.net/
 - http://nominatim.misiones.gob.ar/pdi/

## Attribution

Strongly based on :
 - http://unterkunftskarte.de/
 - http://osm24.eu/
 - https://github.com/simon04/POImap/
