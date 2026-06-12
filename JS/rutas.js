const rutas = [];
let rutaSeleccionada = null;

const rutasTB = document.getElementById("rutasTB");
const formRuta = document.getElementById("formRuta");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const titulo = document.getElementById("form-title");
const URL = "http://127.0.0.1:8002/ruta"; 
const getRutaForm = () => ({
    ciudad_origen: document.getElementById("origen").value.trim(),
    ciudad_destino: document.getElementById("destino").value.trim(),
    distancia: parseInt(document.getElementById("distancia").value) || 0,
    tiempo_estimado: parseFloat(document.getElementById("tiempo_estimado").value) || 0,
    observaciones: "Ruta principal" // Valor por defecto o mapeado si tienes el input
});
const setRutaForm = (ruta) => {
    document.getElementById("origen").value = ruta.ciudad_origen;
    document.getElementById("destino").value = ruta.ciudad_destino;
    document.getElementById("distancia").value = ruta.distancia;
    document.getElementById("tiempo_estimado").value = ruta.tiempo_estimado;
};
const mostrarRutas = () => {
    const tbody = rutasTB.querySelector("tbody");
    tbody.innerHTML = "";
    rutas.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.ciudad_origen}</td>
            <td>${item.ciudad_destino}</td>
            <td>${item.distancia} km</td>
            <td>${item.tiempo_estimado} h</td>
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
const consultarRutas = async () => {
    try {
        rutas.length = 0;
        const response = await fetch(URL);
        const body = await response.json();
        
        body.forEach(item => {
            rutas.push({
                id: item.id,
                ciudad_origen: item.ciudad_origen,    // Campo corregido
                ciudad_destino: item.ciudad_destino,  // Campo corregido
                distancia: item.distancia,
                tiempo_estimado: item.tiempo_estimado,
                observaciones: item.observaciones
            });
        });
        mostrarRutas();
    } catch(ex){
        showModal("Error consultando rutas.", "error");
    }
};
const registrarRuta = async () => {
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getRutaForm())
        });

        const body = await response.json();
        if (response.ok) {
            showModal("Ruta registrada con éxito.", "ok");
            consultarRutas();
            formRuta.reset();
        } else {
            showModal(body.error || "Error al registrar la ruta.", "error");
        }
    } catch(ex){
        showModal("Error de conexión con el servidor.", "error");
    }
};
const actualizarRuta = async () => {
    try {
        const response = await fetch(`${URL}/${rutaSeleccionada.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getRutaForm())
        });
        const body = await response.json();

        if (response.ok) {
            showModal("Ruta actualizada correctamente.", "ok");
            consultarRutas();
            cancelarEdicion();
        } else {
            showModal(body.error || "Error al actualizar la ruta.", "error");
        }
    } catch(ex){
        showModal("Error de conexión con el servidor.", "error");
    }
};
const prepararEdicion = (ruta) => {
    rutaSeleccionada = ruta;
    setRutaForm(ruta);
    titulo.textContent = "Editar Ruta";
    btnGuardar.textContent = "Actualizar Ruta";
    btnCancelar.classList.remove("hidden");
};
const cancelarEdicion = () => {
    rutaSeleccionada = null;
    formRuta.reset();
    titulo.textContent = "Registrar Nueva Ruta";
    btnGuardar.textContent = "Guardar Ruta";
    btnCancelar.classList.add("hidden");
};
formRuta.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = getRutaForm();
    if (!data.ciudad_origen || !data.ciudad_destino || data.distancia <= 0 || data.tiempo_estimado <= 0) {
        showModal("Todos los campos son obligatorios y deben ser mayores a cero.", "error");
        return;
    }
    rutaSeleccionada ? actualizarRuta() : registrarRuta();
});
btnCancelar.addEventListener("click", cancelarEdicion);
document.addEventListener("DOMContentLoaded", () => {
    consultarRutas();
});