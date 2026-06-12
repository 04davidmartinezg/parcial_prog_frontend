const viajes = [];
let viajeSeleccionado = null;
const viajesTB = document.getElementById("viajesTB");
const formViaje = document.getElementById("formViaje");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const titulo = document.getElementById("form-title");
const URL_PROG_VIAJES = "http://127.0.0.1:8003/progviajes"; 
const URL_CONDUCTORES = "http://127.0.0.1:8002/conductores";
const URL_VEHICULOS   = "http://127.0.0.1:8000/vehiculos";
const URL_RUTAS       = "http://127.0.0.1:8003/rutas";
const selectConductor = document.getElementById("selectConductor");
const selectVehiculo = document.getElementById("selectVehiculo");
const selectRuta = document.getElementById("selectRuta");
const getViajeForm = () => ({
    conductor_id: selectConductor.value,
    vehiculo_id: selectVehiculo.value,
    ruta_id: selectRuta.value,
    fecha_programacion: document.getElementById("fecha_programacion").value
});
const setViajeForm = (viaje) => {
    selectConductor.value = viaje.conductor_id;
    selectVehiculo.value = viaje.vehiculo_id;
    selectRuta.value = viaje.ruta_id;
    document.getElementById("fecha_programacion").value = viaje.fecha_programacion;
};
const cargarSelectores = async () => {
    try {
        const [resCond, resVeh, resRut] = await Promise.all([
            fetch(URL_CONDUCTORES),
            fetch(URL_VEHICULOS),
            fetch(URL_RUTAS)
        ]);
        const listaConductores = await resCond.json();
        const listaVehiculos = await resVeh.json();
        const listaRutas = await resRut.json();
        selectConductor.innerHTML = '<option value="">-- Seleccione Conductor --</option>';
        listaConductores.forEach(c => {
            if (c.estado.toLowerCase() === "disponible") {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = `${c.nombres} ${c.apellidos}`;
                selectConductor.appendChild(opt);
            }
        });
        selectVehiculo.innerHTML = '<option value="">-- Seleccione Vehículo --</option>';
        listaVehiculos.forEach(v => {
            const opt = document.createElement("option");
            opt.value = v.id;
            opt.textContent = `${v.marca} (${v.placa})`;
            selectVehiculo.appendChild(opt);
        });
        selectRuta.innerHTML = '<option value="">-- Seleccione Ruta --</option>';
        listaRutas.forEach(r => {
            const opt = document.createElement("option");
            opt.value = r.id;
            opt.textContent = `${r.origen} a ${r.destino}`;
            selectRuta.appendChild(opt);
        });
    } catch (error) {
        console.error("Error cargando datos en los selectores:", error);
    }
};
const mostrarViajes = () => {
    const tbody = viajesTB.querySelector("tbody");
    tbody.innerHTML = ""; 
    viajes.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.fecha_programacion}</td>
            <td>${item.conductor_nombre || 'ID: ' + item.conductor_id}</td>
            <td>${item.vehiculo_placa || 'ID: ' + item.vehiculo_id}</td>
            <td>${item.ruta_nombre || 'ID: ' + item.ruta_id}</td>
            <td>
                <button class="btn-table btn-warning">Editar</button>
            </td>
        `;
        tr.querySelector("button").addEventListener("click", () => {
            prepararEdicion(item);
        });
        tbody.appendChild(tr);
    });
};
const consultarViajes = async () => {
    try {
        viajes.length = 0;
        const response = await fetch(URL_PROG_VIAJES); 
        const body = await response.json();
        body.forEach(item => {
            viajes.push({
                id: item.id,
                conductor_id: item.conductor_id,
                conductor_nombre: item.conductor_nombre,
                vehiculo_id: item.vehiculo_id,
                vehiculo_placa: item.vehiculo_placa,
                ruta_id: item.ruta_id,
                ruta_nombre: item.ruta_nombre,
                fecha_programacion: item.fecha_programacion
            });
        });
        mostrarViajes();
    } catch (ex) {
        showModal("Error consultando la programación de viajes.", "error");
    }
};
const registrarViaje = async () => {
    try {
        const response = await fetch(URL_PROG_VIAJES, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getViajeForm())
        });
        const body = await response.json();

        if (response.ok) {
            showModal("Viaje programado con éxito.", "ok");
            consultarViajes();
            formViaje.reset();
        } else {
            showModal(body.error || "Error al programar el viaje.", "error");
        }
    } catch (ex) {
        showModal("Error de conexión con el servidor.", "error");
    }
};
const actualizarViaje = async () => {
    try {
        const response = await fetch(`${URL_PROG_VIAJES}/${viajeSeleccionado.id}`, { // <-- Corregido a URL_PROG_VIAJES
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getViajeForm())
        });
        const body = await response.json();
        if (response.ok) {
            showModal("Itinerario actualizado correctamente.", "ok");
            consultarViajes();
            cancelarEdicion();
        } else {
            showModal(body.error || "Error al actualizar el itinerario.", "error");
        }
    } catch (ex) {
        showModal("Error de conexión con el servidor.", "error");
    }
};
const prepararEdicion = (viaje) => {
    viajeSeleccionado = viaje;
    setViajeForm(viaje);
    titulo.textContent = "Editar Itinerario";
    btnGuardar.textContent = "Actualizar Viaje";
    btnCancelar.classList.remove("hidden");
};
const cancelarEdicion = () => {
    viajeSeleccionado = null;
    formViaje.reset();
    titulo.textContent = "Programar Itinerario";
    btnGuardar.textContent = "Guardar Viaje";
    btnCancelar.classList.add("hidden");
};
formViaje.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = getViajeForm();
    if (!data.conductor_id || !data.vehiculo_id || !data.ruta_id || !data.fecha_programacion) {
        showModal("Todos los campos de la asignación son obligatorios.", "error");
        return;
    }
    viajeSeleccionado ? actualizarViaje() : registrarViaje();
});
btnCancelar.addEventListener("click", cancelarEdicion);
document.addEventListener("DOMContentLoaded", async () => {
    await cargarSelectores(); 
    consultarViajes();       
});