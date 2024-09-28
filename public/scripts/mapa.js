//Inicio el mapa en la coordenada , con zoom 
var map = L.map('map').setView([6.268658, -75.565801], 13);

//Inicio mapa base de un proveedor (OSM)

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

//Información Cartográfica
var marker = L.marker([6.268658, -75.565801]).addTo(map);
marker.bindPopup("<b>Mi primer PopUp!</b><br>Yo estoy en Medellín").openPopup();

var circle = L.circle([6.273052, -75.575199], {
    color: '#17c0bd',
    fillColor: '#17c0bd',
    fillOpacity: 0.5,
    radius: 1000
});

circle.bindPopup("Inserté un Circulo");

var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap.HOT": osmHOT,
    "Esri": Esri_WorldImagery
};

var overlayMaps = {
    "marker": marker,
    "circle": circle,
    

};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

var frontera;
// Cargar el archivo GeoJSON
fetch('/geoJSON/fronteras_wgs84.geojson')
    .then(response => response.json())
    .then(data => {
        // Añadir el GeoJSON al mapa con estilos y eventos
        frontera=L.geoJSON(data, {
            style: estiloBarrio,  // Aplica la función de estilo
            onEachFeature: function (feature, layer) {
                // Añadir popups para los barrios
                if (feature.properties && feature.properties.nombre_bar) {
                    layer.bindPopup("Barrio: <br>" + feature.properties.nombre_bar);
                }
            }
        });
                // Agregar la capa GeoJSON al control de capas
                layerControl.addOverlay(frontera, 'Barrios de Medellín');
    })
    .catch(err => console.error('Error cargando el archivo GeoJSON: ', err));

// Función de estilo para personalizar el color de los barrios
function estiloBarrio(feature) {
    var baseStyle = {
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };

    // Ajustar el color en función del nombre del barrio
    switch (feature.properties.nombre_bar) {
        case 'Laureles':   // Cambia 'Laureles' por el nombre real del barrio en el GeoJSON
            baseStyle.color = '#ff0000';  // Color rojo para el borde
            baseStyle.fillColor = '#ffb3b3';  // Color de relleno rojo claro
            break;
        case 'La Floresta':
            baseStyle.color = '#00ff00';  // Color verde para el borde
            baseStyle.fillColor = '#b3ffb3';  // Color de relleno verde claro
            break;
        case 'Las Palmas':
            baseStyle.color = '#0000ff';  // Color azul para el borde
            baseStyle.fillColor = '#b3b3ff';  // Color de relleno azul claro
            break;
        default:
            baseStyle.color = '#cccccc';  // Color gris para el borde
            baseStyle.fillColor = '#e6e6e6';  // Color de relleno gris claro
    }
    return baseStyle;
}

//variable que tiene el estilo
// var stilo_barrios_med = {
//     radius: 8,
//     fillColor: "#17c0bd",
//     color: "#17c0bd",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.7
// }

var customIcon = L.icon({
    iconUrl: 'icon/camara-de-cctv.png',  // Ruta a la imagen del icono
    iconSize: [32, 32],               // Tamaño del ícono (ancho, alto)
    iconAnchor: [16, 32],             // Punto de anclaje del ícono (coordenadas en la imagen)
    popupAnchor: [0, -32]             // Punto de anclaje del popup relativo al ícono
});
var camaras;
// Cargar el archivo GeoJSON
fetch('/geoJSON/camaras_wgs84.geojson')
    .then(response => response.json())
    .then(data => {
        // Añadir el GeoJSON al mapa con estilos y eventos
        frontera=L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                // Crear un marcador con el ícono personalizado
                return L.marker(latlng, { icon: customIcon });
            },
            style: estiloBarrio,  // Aplica la función de estilo
            onEachFeature: function (feature, layer) {
                // Añadir popups para los barrios
                if (feature.properties && feature.properties.link_foto) {
                    layer.bindPopup('<img src="' + feature.properties.link_foto + '" alt="" style="width: 300px;"><p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt reiciendis eius quia vel unde harum cum omnis cumque eaque praesentium consequuntur aperiam, quo facere, ut vitae ex repellendus aut ad?</p>');
                }
            }
        });
                // Agregar la capa GeoJSON al control de capas
                layerControl.addOverlay(frontera, 'CCTV Medellín');
    })
    .catch(err => console.error('Error cargando el archivo GeoJSON: ', err));

    // Crear la capa base para el minimapa
var miniMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

// Agregar el minimapa en la esquina inferior izquierda
var miniMap = new L.Control.MiniMap(miniMapLayer, {
    toggleDisplay: true,  // Permite ocultar/mostrar el minimapa
    minimized: false,     // Minimapa visible por defecto
    position: 'bottomleft' // Posición del minimapa
}).addTo(map);