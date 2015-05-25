var titleTmpl = '<h3>{{title}}</h3>';
var tagTmpl = '<span class="fa fa-{{iconName}}"></span> <strong>{{tag}}:</strong> {{value}}<br>';

function develop_parser(element) {
    var tags = element.tags;
    var markerPopup = '<h2>Etiquetes</h2>';
    var tagTmpl = '<tr><td><strong>{{tag}}</strong></td><td>{{value}}</td></tr>';
    markerPopup += '<table>';

    for (tag in tags) {
	markerPopup += Mustache.render(
	    tagTmpl,
	    {tag: tag, value: tags[tag]});
    }
    markerPopup += '<table>';

    markerPopup += '<h2>Accions</h2>';

    // View in OpenStreetMap
    var link = Mustache.render(
	'http://www.openstreetmap.org/node/{{id}}',
	{id: element.id}
    );
    markerPopup += Mustache.render(
	'<a href="{{link}}" target="_blank">Visualitza a OpenStreetMap</a> <br />',
	{link: link}
    );

    // Edit in OpenStreetMap
    var link = Mustache.render(
	'http://www.openstreetmap.org/edit?editor=id&node={{id}}',
	{id: element.id}
    );
    markerPopup += Mustache.render(
	'<a href="{{link}}" target="_blank">Edita a OpenStreetMap</a> <br />',
	{link: link}
    );

    return markerPopup;
}

function address_parser(element) {
    var tags = element.tags;
    var markerPopup = '';

    if (tags['addr:street']) {
	var value = tags['addr:street']
	if (tags['addr:housenumber']) {
	    value += ' ' + tags['addr:housenumber'];
	}
	markerPopup += Mustache.render(
	    tagTmpl,
	    {tag: 'Adreça', value: value, iconName: 'map-marker'}
	);
    }
    return markerPopup;
}

function website_parser(element) {
    var tags = element.tags;
    var tag = tags.website ? tags.website : tags['contact:website'];
    var markerPopup = '';

    if (tag) {
	if (tag.indexOf('http://') == -1)
	    tag = 'http://' + tag;
	var link = Mustache.render(
	    '<a href="{{link}}" target="_blank">{{link}}</a>',
	    {link: tag}
	);
	markerPopup += Mustache.render(
	    tagTmpl,
	    {tag: 'Lloc web', value: link, iconName: 'globe'}
	);
    }
    return markerPopup;
}

function email_parser(element) {
    var tags = element.tags;
    var tag = tags.email ? tags.email : tags['contact:email'];
    var markerPopup = '';

    if (tag) {
	if (tag.indexOf('@') == -1) return markerPopup
	var link = Mustache.render(
	    '<a href="mailto:{{email}}" target="_blank">{{email}}</a>',
	    {email: tag}
	);
	markerPopup += Mustache.render(
	    tagTmpl,
	    {tag: 'Correu', value: link, iconName: 'at'}
	);
    }
    return markerPopup;
}

function phone_parser(element) {
    var tags = element.tags;
    var tag = tags.phone ? tags.phone : tags['contact:phone'];
    var markerPopup = '';

    if (tag) {
	if (tag.indexOf('+') == -1) return markerPopup
	var link = Mustache.render(
	    '<a href="tel:{{phone}}" target="_blank">{{phone}}</a>',
	    {phone: tag}
	);
	markerPopup += Mustache.render(
	    tagTmpl,
	    {tag: 'Telèfon', value: link, iconName: 'phone'}
	);
    }
    return markerPopup;
}

function generic_tag_parser(element, tag, tagName, iconName) {
    var tags = element.tags;
    var markerPopup = '';

    if (tags[tag]) {
	markerPopup += Mustache.render(
	    tagTmpl,
	    {tag: tagName, value: tags[tag], iconName: iconName}
	);
    }
    return markerPopup;
}

function generic_yes_no_tag_parser(element, tag, tagName, iconName) {
    var tags = element.tags;
    var markerPopup = '';
    var iconName = iconName ? iconName : 'info-circle';
    var yes = false;

    if (tags[tag] == 'yes') yes = '<span class="fa fa-check"></span>';
    else if (tags[tag] == 'no') yes = '<span class="fa fa-remove"></span>';

    if (!yes) return ''

    markerPopup += Mustache.render(
	tagTmpl,
	{tag: tagName, value: yes, iconName: iconName}
    );

    return markerPopup;
}

function bank_parser(element) {
    return parse_tags(
	element,
	'Banc',
	[
	    {callback: generic_yes_no_tag_parser, tag: 'atm', label: 'Caixer automàtic'},
	    {callback: generic_tag_parser, tag: 'network', label: 'Red'},
	]
    );
}

function generic_poi_parser(element, titlePopup) {
    return parse_tags(
	element,
	titlePopup,
	[]
    );
}

function fuel_parser(element) {
    return parse_tags(
	element,
	'Estació de servei',
	[
	    {callback: generic_tag_parser, tag: 'brand', label: 'Marca'},
	    {callback: generic_yes_no_tag_parser, tag: 'fuel:diesel', label: 'Diesel'},
	    {callback: generic_yes_no_tag_parser, tag: 'fuel:cng', label: 'GNC'},
	]
    );
}

function hotel_parser(element) {
    return parse_tags(
	element,
	'Hotel',
	[
	    {callback: generic_tag_parser, tag: 'stars', label: 'Estrelles', iconName: 'star'},
	]
    );
}

function hospital_parser(element) {
    return parse_tags(
	element,
	'Hospital',
	[
	    {callback: generic_yes_no_tag_parser, tag: 'emergency', label: 'Emergèncias', iconName: 'plus'},
	]
    );
}

function opening_tag_parser(element) {
    var tags = element.tags;
    var markerPopup = '';

    if (tags['opening_hours']) {
	markerPopup += Mustache.render(
	    tagTmpl,
	    {tag: 'Horari', value: tags['opening_hours'], iconName: 'clock-o'}
	);
    }
    return markerPopup;
}

// https://github.com/ypid/opening_hours.js
function parse_osm_times(element) {
    try
    {
	var hours = element.tags["opening_hours"];
        var oh = new opening_hours(hours);
        var state = oh.getStateString();
	var nextchange = oh.getNextChange();
        // console.log(state)
	if (state == "open") {
	return "<span style='color:green' class='fa fa-circle'></span> <b>Estat:</b> Obert.<br><span style='color:red' class='fa fa-arrow-circle-down'></span> <b>Tancarà:</b> " + nextchange + "<br>";
	}
	else if (state == "close") {
	return "<span style='color:red' class='fa fa-circle'></span> <b>Estat:</b> Tancat.<br><span style='color:green' class='fa fa-arrow-circle-up'></span> <b>Obrirà:</b> " + nextchange + "<br>";
	}
	else if (state == "undefined") {
	return "<span style='color:gray' class='fa fa-circle'></span> <b>Estat:</b> Indefinit.<br><span style='color:gray' class='fa fa-arrow-circle-right'></span> <b>Canviarà l'estat:</b> " + nextchange + "<br>";
	}
	
	}
    catch(err)
    {
        //console.log("ERROR: cannot parse hours: " + hours);
        return "<span style='color:gray' class='fa fa-circle'></span> <b>Estat:</b> Desconegut<br>";
    }
}

function internet_access_parser(element) {
    var tags = element.tags;
    var markerPopup = '';
    var yes = false;

    if (tags.internet_access == 'yes' ||
	tags.internet_access == 'wlan' ||
	tags.internet_access == 'free') yes = '<span class="fa fa-check"></span>';
    else if (tags.internet_access == 'no') yes = '<span class="fa fa-remove"></span>';

    if (!yes) return ''

    markerPopup += Mustache.render(
	tagTmpl,
	{tag: 'WiFi', value: yes, iconName: 'wifi'}
    );

    return markerPopup;
}

function parse_tags(element, titlePopup, functions) {
    // functions = [
    //  {callback: generic_tag_parse,  tag: 'name', label: 'Nombre'},
    //  {callback: address_parser},
    //  {callback: generic_yes_no_tag_parser, tag: 'fuel:diesel', label: 'Diesel'}
    // ]

    var markerPopup = '';
    markerPopup += Mustache.render(
	titleTmpl,
	{title: titlePopup}
    );

    functions = [
	{callback: generic_tag_parser, tag: 'name', label: 'Nom'},
	{callback: address_parser},
	{callback: phone_parser},
	{callback: generic_tag_parser, tag: 'contact:fax', label: 'Fax', iconName: 'fax'},
	{callback: internet_access_parser},
	{callback: email_parser},
	{callback: website_parser},
	{callback: opening_tag_parser},
	{callback: parse_osm_times},
	{callback: generic_tag_parser, tag: 'description', label: 'Descripció'},
    ].concat(functions)

    for (var i = 0; i < functions.length; i++) {
	var data = functions[i]
	if (data.tag && data.label) {
	    var iconName = data.iconName ? data.iconName : 'info-circle';
	    markerPopup += data.callback(element, data.tag, data.label, iconName);
	}
	else {
	    markerPopup += data.callback(element);
	}
    }

	markerPopup += '<br><a href="#" onclick="javascript: sidebar.open(\'developer\'); return false;">Informació al detall (expert)</a>';

    return markerPopup;
}
