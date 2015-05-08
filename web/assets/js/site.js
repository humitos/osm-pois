// spinner
var spinner = 0;

// Don't scape HTML string in Mustache
Mustache.escape = function (text) { return text; }

// https://github.com/Leaflet/Leaflet
var map = new L.Map('map');
var iconLayer = new L.LayerGroup();
map.addLayer(iconLayer);

var attribution = 'Datos &#169; Colaboradores <a href="http://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';

var tileLayerData = {
    std: {
	name: 'Estándar (Mapnik)',
	url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	zoom: '19'
    },
    hot: {
	name: 'Equipo Humanitario',
	url: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
	attribution: 'Teselas <a href="http://hot.openstreetmap.org/" target="_blank">Equipo Humanitario OpenStreetMap</a>',
	zoom: '20'
    },
    osmfr: {
	name: 'OSM Francia',
	url: 'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
	attribution: 'Teselas <a href="http://openstreetmap.fr/" target="_blank">OpenStreetMap Francia</a>',
	zoom: '20'
    },
    cycle: {
	name: 'Bicicleta',
	url: 'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
	attribution: 'Teselas <a href="http://thunderforest.com/opencyclemap/" target="_blank">ThunderForest</a>',
	zoom: '18'
    },
    transport: {
	name: 'Transporte Público',
	url: 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
	attribution: 'Teselas <a href="http://thunderforest.com/transport/" target="_blank">ThunderForest</a>',
	zoom: '20'
    },
    landscape: {
	name: 'Paisaje',
	url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
	attribution: 'Teselas <a href="http://thunderforest.com/landscape/" target="_blank">ThunderForest</a>',
	zoom: '18'
    },
    outdoor: {
	name: 'Al Aire Libre',
	url: 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
	attribution: 'Teselas <a href="http://thunderforest.com/outdoors/" target="_blank">ThunderForest</a>',
	zoom: '18'
    },
    lyrk: {
	name: 'Lyrk',
	url: 'http://tiles.lyrk.org/ls/{z}/{x}/{y}?apikey=3d836013a4ab468f965bfd1328d89522',
	attribution: 'Teselas <a href="http://lyrk.de/" target="_blank">Lyrk</a>',
	zoom: '18'
    },
    mapbox: {
	name: 'MapBox (Calles)',
	url: 'http://{s}.tiles.mapbox.com/v3/51114u9.kogin3jb/{z}/{x}/{y}.png',
	attribution: 'Teselas <a href="http://mapbox.com/" target="_blank">MapBox</a>',
	zoom: '19'
    },
    mapquest: {
	name: 'MapQuest Open',
	url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
	attribution: 'Teselas <a href="http://mapquest.com/" target="_blank">MapQuest</a>',
	subdomains: '123',
	zoom: '18'
    },
    mapsurfer: {
	name: 'OpenMapSurfer',
	url: 'http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}',
	attribution: 'Teselas <a href="http://giscience.uni-hd.de/" target="_blank">GIScience Research Group @ Heidelberg University</a>',
	zoom: '19'
    }
};

var tileLayers = {};
for (tile in tileLayerData) {
    var tileAttribution;
    var tilemaxZoom = tileLayerData[tile].zoom;
    var subdomains = tileLayerData[tile].subdomains ? tileLayerData[tile].subdomains : 'abc';
    if (tileLayerData[tile].attribution) {
	tileAttribution = tileLayerData[tile].attribution + ' &mdash; ' + attribution;
    }
    else tileAttribution = attribution;

    tileLayers[tileLayerData[tile].name] = L.tileLayer(
	tileLayerData[tile].url,
	{maxNativeZoom: tilemaxZoom, maxZoom: 20, attribution: tileAttribution, subdomains: subdomains}
    )
}

tileLayers['Estándar (Mapnik)'].addTo(map);
L.control.layers(tileLayers).addTo(map);


// https://github.com/Turbo87/sidebar-v2/
var sidebar = L.control.sidebar('sidebar').addTo(map);
//$(document).ready(function () {
    // open #home sidebar-pane to show the available POIs
//    sidebar.open('home');
//});

// https://github.com/mlevans/leaflet-hash
var hash = new L.Hash(map);

// update the permalink when L.Hash changes the #hash
window.onhashchange = function() {
    update_permalink();
}


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
    onLocationError: function(err) {
	alert('Disculpa. Hubo un error al intentar localizar tu ubicación.');
    }
}).addTo(map);

// https://github.com/rowanwins/leaflet-easyPrint
L.easyPrint().addTo(map)

// https://github.com/ebrelsford/Leaflet.loading
var loadingControl = L.Control.loading({
    separate: true
});
map.addControl(loadingControl);

// https://github.com/makinacorpus/Leaflet.RestoreView
if (!map.restoreView()) {
    map.setView([-27.4927, -58.8063], 12);
}

var query = '';
show_pois_checkboxes();
build_overpass_query();

var uri = URI(window.location.href);
if (uri.hasQuery('pois')) {
    var selectedPois = uri.search(true).pois;
    if (!$.isArray(selectedPois)) {
	poi = selectedPois.replace('/', '');
	$('#pois input[data-key='+ poi + ']').attr('checked', true);
    }
    else {
	for (i = 0; i < selectedPois.length; i++) {
	    // the last poi has a "/" on it because leaflet-hash
	    poi = selectedPois[i].replace('/', '');
	    $('#pois input[data-key='+ poi + ']').attr('checked', true);
	}
    }
    setting_changed();
}

// Local search functions

var feature2

function chooseAddr(lat1, lng1, lat2, lng2, osm_type) {
	var loc1 = new L.LatLng(lat1, lng1);
	var loc2 = new L.LatLng(lat2, lng2);
	var bounds = new L.LatLngBounds(loc1, loc2);

	if (feature2) {
		map.removeLayer(feature2);
	}
	if (osm_type == "node") {
		feature2 = L.circle( loc1, 15, {color: 'green', fill: false}).addTo(map);
		map.fitBounds(bounds);
		map.setZoom(19);
		sidebar.close();
	} else {
		var loc3 = new L.LatLng(lat1, lng2);
		var loc4 = new L.LatLng(lat2, lng1);
		feature2 = L.polyline( [loc1, loc4, loc2, loc3, loc1], {color: 'red'}).addTo(map);
		map.fitBounds(bounds);
		sidebar.close();	
	}
}

function addr_search() {
    var inp = document.getElementById("addr");

    // &viewbox=1.9341,41.4200,1.9886,41.3993&bounded=1 --> Coordinates (lat,long) for search box
    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&viewbox=1.9341,41.4200,1.9886,41.3993&bounded=1&limit=5&q=' + inp.value, function(data) {
        var items = [];

        $.each(data, function(key, val) {
            bb = val.boundingbox;
            items.push("<li class='fa fa-dot-circle-o' style='padding:5px;'> <a href='#' onclick='chooseAddr(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></li>');
        });

		$('#results').empty();
        if (items.length != 0) {
            $('<p>', { html: "Resultats de la cerca:" }).appendTo('#results');
            $('<ul/>', {
                'class': 'my-new-list',
                html: items.join('')
            }).appendTo('#results');
	    $('<p>', { html: "Seleccioneu la vostra cerca per visualitzar-la al mapa."}).appendTo('#results');
        } else {
            $('<p>', { html: "No s'han trobat resultats" }).appendTo('#results');
        }
    });
}

// Global search functions

var feature3

function chooseAddr2(lat1, lng1, lat2, lng2, osm_type) {
	var loc1 = new L.LatLng(lat1, lng1);
	var loc2 = new L.LatLng(lat2, lng2);
	var bounds = new L.LatLngBounds(loc1, loc2);

	if (feature3) {
		map.removeLayer(feature3);
	}
	if (osm_type == "node") {
		feature3 = L.circle( loc1, 15, {color: 'blue', fill: false}).addTo(map);
		map.fitBounds(bounds);
		map.setZoom(19);
		sidebar.close();
	} else {
		var loc3 = new L.LatLng(lat1, lng2);
		var loc4 = new L.LatLng(lat2, lng1);
		feature3 = L.polyline( [loc1, loc4, loc2, loc3, loc1], {color: 'blue'}).addTo(map);
		map.fitBounds(bounds);
		sidebar.close();
	}
}

function addr_search2() {
    var inp = document.getElementById("addr2");

    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=10&q=' + inp.value, function(data) {
        var items = [];

        $.each(data, function(key, val) {
            bb = val.boundingbox;
            items.push("<li class='fa fa-dot-circle-o' style='padding:5px;'> <a href='#' onclick='chooseAddr2(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></li>');
        });

		$('#results2').empty();
        if (items.length != 0) {
            $('<p>', { html: "Resultats de la cerca:" }).appendTo('#results2');
            $('<ul/>', {
                'class': 'my-new-list',
                html: items.join('')
            }).appendTo('#results2');
	    $('<p>', { html: "Seleccioneu la vostra cerca per visualitzar-la al mapa."}).appendTo('#results2');
        } else {
            $('<p>', { html: "No s'han trobat resultats" }).appendTo('#results2');
        }
    });
}

function clear_layer2()
	{
		var inp = document.getElementById("addr");
		$('#results').empty();
		$('<p>', { html: " " }).appendTo('#results');
	if (feature2) {
		map.removeLayer(feature2);
	}

}

function clear_layer3()
	{
		var inp = document.getElementById("addr2");
		$('#results2').empty();
		$('<p>', { html: " " }).appendTo('#results2');
	if (feature3) {
		map.removeLayer(feature3);
	}
}

expert_mode_init();
