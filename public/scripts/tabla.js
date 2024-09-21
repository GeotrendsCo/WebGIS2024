// Obtener el selector de tablas
const tablaSelector = document.getElementById('tablaSelector');
const tablaDatos = document.getElementById('tablaDatos');

// Función para cargar las tablas en el selector
async function cargarTablas() {
    const respuesta = await fetch('/tablas');
    const tablas = await respuesta.json();
    tablas.forEach(tabla => {
        const option = document.createElement('option');
        option.value = tabla.table_name;
        option.textContent = tabla.table_name;
        tablaSelector.appendChild(option);
    });
}

// Función para cargar los datos de la tabla seleccionada
async function cargarDatosTabla(nombreTabla) {
    const respuesta = await fetch(`/tablas/${nombreTabla}`);
    const datos = await respuesta.json();
    
    // Limpiar tabla existente
    tablaDatos.querySelector('thead tr').innerHTML = '';
    tablaDatos.querySelector('tbody').innerHTML = '';

    // Si no hay datos, no mostramos la tabla
    if (datos.length === 0) return;

    // Crear los encabezados de la tabla basados en los campos del primer registro
    const headers = Object.keys(datos[0]);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tablaDatos.querySelector('thead tr').appendChild(th);
    });

    // Crear las filas de la tabla
    datos.forEach(fila => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = fila[header];
            tr.appendChild(td);
        });
        tablaDatos.querySelector('tbody').appendChild(tr);
    });
}

// Evento para cuando se seleccione una tabla
tablaSelector.addEventListener('change', (event) => {
    const nombreTabla = event.target.value;
    if (nombreTabla) {
        cargarDatosTabla(nombreTabla);
    }
});

// Cargar las tablas al cargar la página
cargarTablas();