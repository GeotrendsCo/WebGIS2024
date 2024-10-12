// Inicializar el mapa
var map = L.map('map').setView([6.268658, -75.565801], 13);

// Mapas base
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var baseMaps = {
    "OpenStreetMap": osm,
    "Esri World Imagery": Esri_WorldImagery,
    "Mapa Hot":osmHOT
};

// Control de capas para los overlays
var overlayMaps = {};

// Agregar control de capas al mapa
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// Capas en el programa geojson
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

// Cargar el archivo GeoJSON
fetch('/geoJSON/fronteras_wgs84.geojson')
    .then(response => response.json())
    .then(data => {
        // Añadir el GeoJSON al mapa con estilos y eventos
        frontera = L.geoJSON(data, {
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

// Listado de capas que son de tipo punto
const capasTipoPunto = {
  "wgs84_estaciones_de_clasificaci": estiloEstacionesClasificacion,
  // Puedes añadir más capas de tipo punto y sus funciones de estilo
};
// Definir un icono personalizado para las estaciones de clasificación
var estacionIcon = L.icon({
  iconUrl: '/icon/camara-de-cctv.png',  // Ruta a tu imagen de icono
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Función de estilo para las estaciones de clasificación
function estiloEstacionesClasificacion(feature, latlng) {
return L.marker(latlng, { icon: estacionIcon });
}

// Si tienes más capas de tipo punto, puedes definir más funciones de estilo:
function estiloOtraCapaDePuntos(feature, latlng) {
// Aquí puedes definir otro icono o marker para otra capa de puntos
return L.marker(latlng, {
  icon: L.icon({
    iconUrl: 'public/icon7camara-de-cctv.png',  // Otro icono
    iconSize: [20, 32],
    iconAnchor: [10, 32],
    popupAnchor: [1, -30]
  })
});
}

// Función para aplicar estilos personalizados según la tabla
function getEstiloPorTabla(nombreTabla) {
  switch (nombreTabla) {
    case 'wgs84_zonas_geoeconomicas_vigen':
      return function estiloZonasGeoeconomicas(feature) {
        var baseStyle = {
          weight: 1,
          opacity: 1,
          fillOpacity: 0.6
        };
        // Ajustar el color en función de una propiedad económica
        switch (feature.properties.categoria_economica) {  // Ajusta esta propiedad según tu tabla
          case 'Alta':
            baseStyle.color = '#ff0000';  // Rojo para zonas de alta categoría económica
            baseStyle.fillColor = '#ffcccc';
            break;
          case 'Media':
            baseStyle.color = '#00ff00';  // Verde para zonas de categoría económica media
            baseStyle.fillColor = '#ccffcc';
            break;
          case 'Baja':
            baseStyle.color = '#0000ff';  // Azul para zonas de categoría económica baja
            baseStyle.fillColor = '#ccccff';
            break;
          default:
            baseStyle.color = '#cccccc';  // Gris por defecto
            baseStyle.fillColor = '#e6e6e6';
        }
        return baseStyle;
      };
    case 'wgs84_red_hidrica_mr':
      return function estiloRedHidrica(feature) {
        return {
          color: '#ffffff',  // Azul para la red hídrica
          weight: 2,
          fillOpacity: 0
        };
      };
    case 'wgs84_estaciones_de_clasificaci':
      return function estiloEstaciones(feature) {
        var baseStyle = {
          radius: 8,
          fillOpacity: 0.9,
          color: '#000',  // Borde negro
          weight: 1
        };
        // Ajustar el color en función del tipo de estación
        switch (feature.properties.tipo_estacion) {  // Ajusta esta propiedad según tu tabla
          case 'Monitoreo':
            baseStyle.fillColor = '#ff0000';  // Rojo para estaciones de monitoreo
            break;
          case 'Clasificación':
            baseStyle.fillColor = '#00ff00';  // Verde para estaciones de clasificación
            break;
          default:
            baseStyle.fillColor = '#0000ff';  // Azul por defecto
        }
        return baseStyle;
      };
    default:
      // Estilo por defecto si no se especifica
      return function estiloDefault(feature) {
        return {
          color: '#125a52',  // Gris por defecto
          weight: 1,
          fillColor: '#e6e6e6',
          fillOpacity: 0.7
        };
      };
  }
}

// Cargar configuración de nombres y popups desde JSON
fetch('scripts/popup_config.json')  // Ajusta la ruta al archivo JSON
.then(response => response.json())
.then(config => {
  var nombresPersonalizados = config.nombres_capas;
  var configPopups = config.popups;

  // Función para cargar tablas con geometría y agregarlas al control de capas con popups personalizados
  fetch('/tablasgeo')
    .then(response => response.json())
    .then(tablas => {
      tablas.forEach(tabla => {
        var nombreTabla = tabla.table_name;
        var nombrePersonalizado = nombresPersonalizados[nombreTabla] || nombreTabla;  // Usar nombre personalizado si está disponible

        // Crear una capa vacía para esta tabla y añadirla al control de capas
        var layer = L.layerGroup();
        layerControl.addOverlay(layer, nombrePersonalizado); // Añadir al control de capas

        // Escuchar cuando el usuario activa la capa en el control
        map.on('overlayadd', function(event) {
          if (event.name === nombrePersonalizado) {
            // Cargar los datos de la tabla y mostrarlos en el mapa
            fetch(`/tablas/${nombreTabla}`)
              .then(response => response.json())
              .then(data => {
                var geoLayer;
                
                // Si la capa es de tipo punto, aplicar el estilo correspondiente
                if (capasTipoPunto[nombreTabla]) {
                  geoLayer = L.geoJSON(data, {
                    pointToLayer: capasTipoPunto[nombreTabla],  // Aplicar la función de estilo correspondiente
                    onEachFeature: function (feature, layer) {
                      // Crear el popup personalizado
                      var popupContent = '';

                      // Obtener configuración de popup para la tabla actual
                      var config = configPopups[nombreTabla];
                      if (config) {
                        popupContent += `<strong>${config.titulo}</strong><br>`;
                        config.campos.forEach(campo => {
                          if (feature.properties[campo.nombre]) {
                            popupContent += `<b>${campo.etiqueta}:</b> ${feature.properties[campo.nombre]}<br>`;
                          }
                        });
                      } else {
                        popupContent = JSON.stringify(feature.properties); // Por defecto
                      }

                      layer.bindPopup(popupContent);  // Añadir popup personalizado
                    }
                  });
                } else {
                  // Si no es de tipo punto, aplica el estilo normal
                  geoLayer = L.geoJSON(data, {
                    style: getEstiloPorTabla(nombreTabla),
                    onEachFeature: function (feature, layer) {
                      var popupContent = '';

                      // Obtener configuración de popup para la tabla actual
                      var config = configPopups[nombreTabla];
                      if (config) {
                        popupContent += `<strong>${config.titulo}</strong><br>`;
                        config.campos.forEach(campo => {
                          if (feature.properties[campo.nombre]) {
                            popupContent += `<b>${campo.etiqueta}:</b> ${feature.properties[campo.nombre]}<br>`;
                          }
                        });
                      } else {
                        popupContent = JSON.stringify(feature.properties); // Por defecto
                      }

                      layer.bindPopup(popupContent);  // Añadir popup personalizado
                    }
                  });
                }
                
                layer.addLayer(geoLayer); // Añadir los datos a la capa
              })
              .catch(err => console.error('Error cargando los datos de la tabla:', err));
          }
        });

        // Escuchar cuando el usuario desactiva la capa en el control
        map.on('overlayremove', function(event) {
          if (event.name === nombrePersonalizado) {
            layer.clearLayers();  // Limpia la capa cuando se desactiva
          }
        });
      });
    })
    .catch(err => console.error('Error obteniendo las tablas con geometría:', err));
})
.catch(err => console.error('Error cargando el archivo JSON de configuración:', err));