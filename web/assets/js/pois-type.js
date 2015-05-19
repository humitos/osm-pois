// All the POIs shown in the map

var pois = {

    biergarten: {
	name: 'Bar',
	query: '[amenity=biergarten]',
	iconName: 'bar_coktail',
    },

    pub: {
	name: 'Pub',
	query: '[amenity=pub]',
	iconName: 'bar',
    },

    restaurant: {
	name: 'Restaurant',
	query: '[amenity=restaurant]',
	iconName: 'restaurant',
    },

    cafe: {
	name: 'Cafè',
	query: '[amenity=cafe]',
	iconName: 'coffee'
    },

//    fast_food: {
//	name: 'Menjar ràpid',
//	query: '[amenity=fast_food]',
//	iconName: 'fastfood'
//    },

    caterer: {
	name: 'Menjar preparat',
	query: '[craft=caterer]',
	iconName: 'takeaway'
    },

    internet_access: {
	name: 'Llocs amb WiFi',
	query: '[internet_access][internet_access!=no]',
	iconName: 'wifi'
    },

    bank: {
	name: 'Banc',
	query: '[amenity=bank]',
	iconName: 'bank',
	tagParser: bank_parser
    },

    atm: {
	name: 'Caixer',
	query: '[amenity=atm]',
	iconName: 'atm-2'
    },

    post_office: {
	name: 'Oficina de correus',
	query: '[amenity=post_office]',
	iconName: 'postal'
    },

    fuel: {
	name: 'Estació de servei',
	query: '[amenity=fuel]',
	iconName: 'fillingstation',
	tagParser: fuel_parser
    },

    wheel_repair: {
	name: 'Rodes',
	query: '[shop=car_repair][car_repair=wheel_repair]',
	iconName: 'tires'
    },

    car_repair: {
	name: 'Mecànic',
	query: '[shop=car_repair][car_repair!=wheel_repair]',
	iconName: 'repair'
    },

    bus_stop: {
	name: 'Parada de bus',
	query: '[highway=bus_stop]',
	iconName: 'busstop'
    },

    bus_station: {
	name: 'Terminal d\'omnibus',
	query: '[amenity=bus_station]',
	iconName: 'bus'
    },

    training: {
	name: 'Acadèmia',
	query: '[amenity=training]',
	iconName: 'school'
    },

    clinic: {
	name: 'Clínica',
	query: '[amenity=clinic]',
	iconName: 'medicine'
    },

    hospital: {
	name: 'Hospital',
	query: '[amenity=hospital]',
	iconName: 'hospital-building',
	tagParser: hospital_parser
    },

    pharmacy: {
	name: 'Farmàcia',
	query: '[amenity=pharmacy]',
	iconName: 'drugstore'
    },

    dentist: {
	name: 'Dentista',
	query: '[amenity=dentist]',
	iconName: 'dentist'
    },

    veterinary: {
	name: 'Veterinari',
	query: '[amenity=veterinary]',
	iconName: 'veterinary'
    },

    physician: {
	name: 'Fisioteràpia',
	query: '[office=physician]',
	iconName: 'massage'
    },

    hairdresser: {
	name: 'Perruqueria',
	query: '[shop=hairdresser]',
	iconName: 'barber'
    },

    beauty: {
	name: 'Estètica',
	query: '[shop=beauty]',
	iconName: 'beautysalon'
    },

    supermarket: {
	name: 'Supermercat',
	query: '[shop=supermarket]',
	iconName: 'supermarket'
    },

    convenience: {
	name: 'Queviures',
	query: '[shop=convenience]',
	iconName: 'conveniencestore'
    },

    bakery: {
	name: 'Forn',
	query: '[shop=bakery]',
	iconName: 'bakery'
    },

    greengrocer: {
	name: 'Fruiteria',
	query: '[shop=greengrocer]',
	iconName: 'fruits'
    },

    farm: {
	name: 'Productes de granja',
	query: '[shop=farm]',
	iconName: 'farmstand'
    },

    herbalist: {
	name: 'Herboristeria',
	query: '[shop=herbalist]',
	iconName: 'herbalist'
    },

    newsagent: {
	name: 'Diaris',
	query: '[shop=newsagent]',
	iconName: 'newsagent'
    },

    kiosk: {
	name: 'Quiosc',
	query: '[shop=kiosk]',
	iconName: 'kiosk'
    },

    pet: {
	name: 'Mascotes',
	query: '[shop=pet]',
	iconName: 'pets'
    },

    video: {
	name: 'Vídeoclub',
	query: '[shop=video]',
	iconName: 'movierental'
    },

    jewelry: {
	name: 'Joieria',
	query: '[shop=jewelry]',
	iconName: 'jewelry'
    },

    fabric: {
	name: 'Merceria',
	query: '[shop=fabric]',
	iconName: 'lingerie'
    },

    computer: {
	name: 'Informàtica',
	query: '[shop=computer]',
	iconName: 'computers'
    },

//    butcher: {
//	name: 'Carniceria',
//	query: '[shop=butcher]',
//	iconName: 'butcher-2'
//    },

    doityourself: {
	name: 'Bricolatge',
	query: '[shop=doityourself]',
	iconName: 'hiretools'
    },


    electrical_equipment: {
	name: 'Mat.elèctric',
	query: '[shop=electrical_equipment]',
	iconName: 'power'
    },

    reforms: {
	name: 'Construccions',
	query: '[craft=reforms]',
	iconName: 'plastering'
    },

    electrician: {
	name: 'Electricista',
	query: '[craft=electrician]',
	iconName: 'power'
    },

    window_construction: {
	name: 'Al·lumini',
	query: '[craft=window_construction]',
	iconName: 'glazer'
    },

    glaziery: {
	name: 'Cristalleria',
	query: '[shop=glaziery]',
	iconName: 'glazer'
    },

    painter: {
	name: 'Pintors',
	query: '[craft=painter]',
	iconName: 'paint'
    },

    furniture: {
	name: 'Mobles',
	query: '[shop=furniture]',
	iconName: 'homecenter'
    },

    carpenter: {
	name: 'Fusteria',
	query: '[craft=carpenter]',
	iconName: 'homecenter'
    },

    garden_furniture: {
	name: 'Productes de jardineria',
	query: '[shop=garden_furniture]',
	iconName: 'lawncareicon'
    },

    swimming_pool: {
	name: 'Botiga de piscines',
	query: '[shop=swimming_pool]',
	iconName: 'swimming2'
    },

    estate_agent: {
	name: 'Immobiliària',
	query: '[office=estate_agent]',
	iconName: 'estateagent'
    },

//    gallery: {
//	name: 'Galeria d\'art',
//	query: '[tourism=gallery]',
//	iconName: 'museum_art'
//    },

//    museum: {
//	name: 'Museu',
//	query: '[tourism=museum]',
//	iconName: 'museum_crafts'
//    },

    theatre: {
	name: 'Teatre',
	query: '[amenity=theatre]',
	iconName: 'theater'
    },

    paintball: {
	name: 'Paintball',
	query: '[sport=shooting][shooting=paintball]',
	iconName: 'paintball'
    },

//    'camp_site': {
//	name: 'Camping',
//	query: '[tourism=camp_site]',
//	iconName: 'camping-2'
//    },

    information: {
	name: 'Informació turística',
	query: '[tourism=information]',
	iconName: 'information'
    },

    hotel: {
	name: 'Hotel',
	query: '[tourism=hotel]',
	iconName: 'hotel_0star',
	tagParser: hotel_parser
    },

//    hostel: {
//	name: 'Hostel',
//	query: '[tourism=hostel]',
//	iconName: 'youthhostel'
//    },


//    sports_centre: {
//	name: 'Club',
//	query: '[leisure=sports_centre]',
//	iconName: 'stadium'
//    },

    viewpoint: {
	name: 'Mirador',
	query: '[tourism=viewpoint]',
	iconName: 'sight-2'
    },

    ruins: {
	name: 'Runes (i cabanes)',
	query: '[historic=ruins]',
	iconName: 'ruins'
    }
}
