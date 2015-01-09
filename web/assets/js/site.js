// spinner
var spinner = 0;

// https://github.com/Leaflet/Leaflet
var map = new L.Map('map');
var iconLayer = new L.LayerGroup();
map.addLayer(iconLayer);

var mapMarkers = {};

// https://github.com/perliedman/leaflet-control-geocoder
var geocoder = L.Control.geocoder({
    position: 'topleft',
    placeholder: 'Buscar...',
    errorMessage: 'Ningún resultado',
    showResultIcons: true
}).addTo(map);

geocoder.markGeocode = function(result) {
    this._map.fitBounds(result.bbox);
    return this;
};


// https://github.com/Turbo87/sidebar-v2/
var sidebar = L.control.sidebar('sidebar').addTo(map);

// https://github.com/mlevans/leaflet-hash
var hash = new L.Hash(map);

// update the permalink when L.Hash changes the #hash
window.onhashchange = function() {
    update_permalink();
}

// https://github.com/leaflet-extras/leaflet-providers
L.tileLayer.provider(
    'OpenStreetMap.Mapnik',
    {
	attribution: 'Data: <a href="http://www.overpass-api.de/">OverpassAPI</a>/ODbL OpenStreetMap'
    }
).addTo(map);

// https://github.com/domoritz/leaflet-locatecontrol
L.control.locate({
    follow: false,
    setView: true,
    keepCurrentZoomLevel: true,
    showPopup: false,
    strings: {
	title: 'Muéstrame donde estoy',
	popup: 'Estás a {distance} metros aprox. de aquí',
	outsideMapBoundsMsg: 'No es posible ubicar tu posición en el mapa'
    },
    onLocationError: function(err) {alert('Disculpa. Hubo un error al intentar localizar tu ubicación.');}
}).addTo(map);

// https://github.com/ebrelsford/Leaflet.loading
var loadingControl = L.Control.loading({
    separate: true
});
map.addControl(loadingControl);


var icons = {
    bar: {
	name: 'Bar',
	query: "[amenity=bar]",
	iconName: 'glass',
	markerColor: 'blue'
    },

    pub: {
	name: 'Pub',
	query: "[amenity=pub]",
	iconName: 'glass',
	markerColor: 'darkblue'
    },

    restaurant: {
	name: 'Restaurante / Comida Rápida',
	query: "[amenity~'restaurant|fast_food']",
	iconName: 'birthday-cake',
	markerColor: 'orange'
    },

    bank: {
	name: 'Banco / Cajero',
	query: "[amenity~'bank|atm']",
	iconName: 'bank',
	markerColor: 'cadetblue'
    },

    'car_repair': {
	name: 'Gomería',
	query: '[shop=car_repair][car_repair=wheel_repair]',
	iconName: 'wrench',
	markerColor: 'red'
    },


    clinic: {
	name: 'Hospital / Clínica',
	query: "[amenity~'^clinic$|hospital']",
	iconName: 'hospital-o',
	markerColor: 'red'
    },
    pharmacy: {
	name: 'Farmacia',
	query: '[amenity=pharmacy]',
	iconName: 'plus-square',
	markerColor: 'green'
    },

    fuel: {
	name: 'Estación de Servicio',
	query: '[amenity=fuel]',
	iconName: 'car',
	markerColor: 'orange'
    },

    supermarket: {
	name: 'Supermercado / Despensa',
	query: "[shop~'supermarket|convenience']",
	iconName: 'calculator',
	markerColor: 'blue'
    },

    viewpoint: {
	name: 'Atractivo Turístico',
	query: "[tourism~'viewpoint|museum|gallery|information|zoo']",
	iconName: 'star',
	markerColor: 'orange'
    },

    'camp_site': {
	name: 'Camping',
	query: '[tourism=camp_site]',
	iconName: 'fire',
	markerColor: 'green'
    },
    hotel: {
	name: 'Hotel',
	query: '[tourism=hotel]',
	iconName: 'building',
	markerColor: 'darkred'
    },
    hostel: {
	name: 'Hostel',
	query: '[tourism=hostel]',
	iconName: 'building',
	markerColor: 'green'
    }
}

// https://github.com/kartenkarsten/leaflet-layer-overpass
function callback(data) {
    if (spinner > 0) spinner -= 1;
    if (spinner == 0) $('#spinner').hide();

    for(i=0; i < data.elements.length; i++) {
	e = data.elements[i];

	if (e.id in this.instance._ids) return;
	this.instance._ids[e.id] = true;

	var pos = new L.LatLng(e.lat, e.lon);

	// TODO: improve this
	var type = ''
	if (e.tags.amenity) {
	    if (e.tags.amenity == 'atm') type = 'bank';
	    if (e.tags.amenity == 'hospital') type = 'clinic';
	    if (type == '') type = e.tags.amenity;
	}
	if (e.tags.tourism) {
	    if (e.tags.tourism in {
		'viewpoint': true,
		'museum': true,
		'information': true,
		'gallery': true,
		'zoo': true
	    }) type = 'viewpoint';
	    else type = e.tags.tourism;
	}
	if (e.tags.shop) {
	    if (e.tags.shop == 'convenience') type = 'supermarket';
	    if (type == '') type = e.tags.shop;
	}
	var icon = icons[type];

	// skip this undefined icon
	if (!icon) {
	    console.info('Skipping undefined icon: "' + type + '"');
	    continue;
	}

	var markerIcon  = L.AwesomeMarkers.icon({
	    icon: icon.iconName,
	    markerColor: icon.markerColor,
	    prefix: 'fa'
	});
	var marker = L.marker(pos, {icon: markerIcon});
	var markerData = {osm_id: e.id, lat: e.lat, lon: e.lon};
	mapMarkers[e.id] = markerData;
	var markerPopup = Mustache.render(
	    '<h3><span class="fa fa-star-o" onclick="toggle_favorite_marker(this, {{osm_id}}, {{lat}}, {{lon}});"></span> Etiquetas</h3>',
	    markerData
	);
	for(tag in e.tags) {
	    markerPopup += Mustache.render(
		'<strong>{{name}}:</strong> {{value}}<br>',
		{name: tag, value: e.tags[tag]});
	}

	marker.bindPopup(markerPopup);
	marker.addTo(this.instance);
    }
}

function build_overpass_query() {
    // FIXME: https://github.com/humitos/osm-pois/issues/5
    query = '(';
    $('#settings input:checked').each(function(i, element) {
	// http://overpass-turbo.eu/s/6QW
	query += "node(BBOX)";
	query += icons[element.dataset.key].query;
	query += ';';
    });
    query += ');out;';
}

function setting_changed() {
    // remove icons from current map
    iconLayer.clearLayers();
    mapMarkers = [];
    build_overpass_query();
    show_overpass_layer();
    update_permalink();
}

function show_settings() {
    for(icon in icons) {
	var checkbox = Mustache.render(
	    '<input type="checkbox" data-key="{{key}}" onclick="setting_changed()"> {{name}}<br>',
	    {key: icon, name: icons[icon].name}
	);
	$('#settings').append(checkbox);
    }
}
show_settings();

var uri = URI(window.location.href);
if (uri.hasQuery('pois')) {
    var selectedPois = uri.search(true).pois;
    if (!$.isArray(selectedPois)) {
	poi = selectedPois.replace('/', '');
	$('#settings input[data-key='+ poi + ']').attr('checked', true);
    }
    else {
	for (i = 0; i < selectedPois.length; i++) {
	    // the last poi has a "/" on it because leaflet-hash
	    poi = selectedPois[i].replace('/', '');
	    $('#settings input[data-key='+ poi + ']').attr('checked', true);
	}	
    }
    setting_changed();
}

// https://github.com/makinacorpus/Leaflet.RestoreView
if (!map.restoreView()) {
    map.setView([-27.4927, -58.8063], 12);
}

var query = '';
build_overpass_query();

var opl;
function show_overpass_layer() {
    if(query == '' || query == '();out;') {
	console.debug('There is nothing selected to filter by.');
	return;
    }
    opl = new L.OverPassLayer({
	query: query,
	callback: callback,
	minzoom: 14,
    });

    iconLayer.addLayer(opl);
}

function get_permalink() {
    var uri = URI(window.location.href);
    var selectedPois = [];
    $('#settings input:checked').each(function(i, element) {
	selectedPois.push(element.dataset.key);
    });

    uri.query({'pois': selectedPois, 'norestoreview': true});
    return uri.href();
}

function update_permalink() {
    var link = get_permalink();
    $('#permalink').attr('href', link);
}


// https://github.com/makinacorpus/Leaflet.FileLayer
L.Control.fileLayerLoad({
    // See http://leafletjs.com/reference.html#geojson-options
    layerOptions: {
	style: {color:'red'},
	pointToLayer: function(feature, latlng) {
	    console.info(feature);
	    console.info(latlng);
	},
	onEachFeature: function(feature, layer) {
	    console.debug(feature);
	    var osmNodeId = feature.properties.desc.split('=')[1];
	    console.info(osmNodeId);
	    if (!mapMarkers[osmNodeId]) {
		console.info('There is no marker for this osmNodeId');

		// TODO: save in favoritesMarkers
		var markerIcon  = L.AwesomeMarkers.icon({
                    icon: 'star',
                    markerColor: 'red',
                    prefix: 'fa'
                });
                var pos = new L.LatLng(
		    feature.geometry.coordinates['0'],
		    feature.geometry.coordinates['1']
		);
                var marker = L.marker(pos, {icon: markerIcon});
                marker.addTo(layer);
            }
            else {
        	// TODO:
		// 1. put filled star in popup
		// 2. highlight the icon
		console.info('This point already exists in OSM');
	    }
	}
    },
    // Add to map after loading (default: true) ?
    addToMap: true,
    // File size limit in kb (default: 1024) ?
    fileSizeLimit: 256,
    // Restrict accepted file formats (default: .geojson, .kml, and .gpx) ?
    formats: ['.gpx']
}).addTo(map);


function generate_favorites() {
    function destroyClickedElement(event) {
	document.body.removeChild(event.target);
    }

    // - lat, lon
    // - osm_id
    GeoJSON.parse(data, {Point: ['lat', 'lon']}, function(geojson){
	console.debug(geojson);
	var textFileAsBlob = new Blob([togpx(geojson)], {type:'text/xml'});
	var downloadLink = document.createElement('a');
	var fileNameToSaveAs = 'favorites.gpx';
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = 'Download File';
	if (window.webkitURL != null) {
	    // webkit
	    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else {
	    // firefox
	    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	    downloadLink.onclick = destroyClickedElement;
	    downloadLink.style.display = 'none';
	    document.body.appendChild(downloadLink);
	}
	downloadLink.click();
    });
}

var data = [];
function toggle_favorite_marker(element, osm_id, lat, lon) {
    element = $(element);
    if (element.hasClass('fa-star-o')) {
	data.push({osm_id: osm_id, lat: lat, lon: lon});
	element.removeClass('fa-star-o');
	element.addClass('fa-star');
    }
    else {
	for (i = 0; i < data.length; i++) {
	    if (data[i] && data[i].osm_id === osm_id) {
		// FIXME: this makes that position 'undefined'
		delete data[i];
		break;
	    }
	}
	element.removeClass('fa-star');
	element.addClass('fa-star-o');	
    }
}
