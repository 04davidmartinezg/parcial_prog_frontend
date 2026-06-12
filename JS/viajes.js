const novedades = [];
let viajeIdActual = null;
const seguimientoTB = document.getElementById("seguimientoTB");
const formNovedad = document.getElementById("formNovedad");
const panelAcciones = document.getElementById("panelAcciones");
const btnCargarViaje = document.getElementById("btnCargarViaje");
const btnIniciar = document.getElementById("btnIniciar");
const btnFinalizar = document.getElementById("btnFinalizar");
const URL_SEGUIMIENTO = "http://127.0.0.1:8004/seguimiento";
const getFechaHoraActual = () => {
    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0];
    return { fecha, hora };
};
const mostrarNovedades = () => {
    const tbody = seguimientoTB.querySelector("tbody");
    tbody.innerHTML = "";

    if (novedades.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; color: #a5a5a5;">El viaje no registra novedades aún.</td></tr>`;
        return;
    }
    novedades.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.fecha} ${item.hora}</td>
            <td><strong>[${item.estado.toUpperCase()}]</strong> ${item.novedad}</td>
        `;
        tbody.appendChild(tr);
    });
};
const consultarSeguimiento = async () => {
    if (!viajeIdActual) return;
    try {
        novedades.length = 0;
        const response = await fetch(`${URL_SEGUIMIENTO}/${viajeIdActual}`);
        const body = await response.json();
        if (response.ok && Array.isArray(body)) {
            body.forEach(item => {
                novedades.push({
                    fecha: item.fecha,
                    hora: item.hora,
                    estado: item.estado || "evento",
                    novedad: item.novedad 
                });
            });
        }
        mostrarNovedades();
    } catch (ex) {
        showModal("Error al consultar la bitácora de la ruta.", "error");
    }
};
btnCargarViaje.addEventListener("click", () => {
    const inputId = document.getElementById("viajeIdInput").value.trim();
    
    if (!inputId) {
        showModal("Debe ingresar un ID de viaje válido.", "error");
        return;
    }
    viajeIdActual = parseInt(inputId);
    document.getElementById("infoViaje").textContent = `#${viajeIdActual}`;
    panelAcciones.classList.remove("hidden");
    
    consultarSeguimiento();
});
btnIniciar.addEventListener("click", async () => {
    const { fecha, hora } = getFechaHoraActual();
    const datos = {
        programacion_viaje_id: viajeIdActual,
        fecha: fecha,
        hora: hora,
        novedad: "Vehiculo inicia recorrido"
    };
    try {
        const response = await fetch(`${URL_SEGUIMIENTO}/iniciar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        if (response.ok) {
            showModal("¡Viaje iniciado con éxito! Camión en ruta.", "ok");
            consultarSeguimiento();
        } else {
            showModal("No se pudo registrar el inicio del viaje.", "error");
        }
    } catch (ex) {
        showModal("Error de conexión con el servidor.", "error");
    }
});
formNovedad.addEventListener("submit", async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById("descripcionNovedad").value.trim();
    const { fecha, hora } = getFechaHoraActual();
    const datos = {
        programacion_viaje_id: viajeIdActual,
        fecha: fecha,
        hora: hora,
        estado: "retrasado", 
        novedad: descripcion
    };
    try {
        const response = await fetch(`${URL_SEGUIMIENTO}/novedad`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        const body = await response.json();
        if (response.ok) {
            showModal("Novedad reportada correctamente.", "ok");
            formNovedad.reset();
            consultarSeguimiento();
        } else {
            showModal(body.error || "Error al registrar la novedad.", "error");
        }
    } catch (ex) {
        showModal("Error de conexión al reportar novedad.", "error");
    }
});
btnFinalizar.addEventListener("click", async () => {
    const { fecha, hora } = getFechaHoraActual();

    const datos = {
        programacion_viaje_id: viajeIdActual,
        fecha: fecha,
        hora: hora,
        novedad: "Viaje completado exitosamente"
    };
    try {
        const response = await fetch(`${URL_SEGUIMIENTO}/finalizar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        if (response.ok) {
            showModal("¡Viaje finalizado con éxito! Operación completada.", "ok");
            consultarSeguimiento();
        } else {
            showModal("No se pudo finalizar el viaje.", "error");
        }
    } catch (ex) {
        showModal("Error de conexión al finalizar el viaje.", "error");
    }
});