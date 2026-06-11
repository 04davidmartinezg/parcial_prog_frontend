
const conductores = [];
let conductorSeleccionado = null; 
const conductoresTabla = document.getElementById("conductoresTB");
const mostrarConductores = () => {
    const tbody = conductoresTabla.getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; 
    for (let item of conductores) {
        const tr = document.createElement("tr");
        const docTd = document.createElement("td");
        docTd.textContent = item.documento;
        const nombreTd = document.createElement("td");
        nombreTd.textContent = `${item.nombres} ${item.apellidos}`;
        const licenciaTd = document.createElement("td");
        licenciaTd.textContent = `${item.num_licencia} (${item.categoria}) - Vence: ${item.fecha_vencimiento}`;
        const estadoTd = document.createElement("td");
        const badge = document.createElement("span");
        badge.textContent = item.estado;
        badge.className = `badge badge-${item.estado.toLowerCase().replace(" ", "-")}`;
        estadoTd.appendChild(badge);
        const accionesTd = document.createElement("td");
        const modificarBtn = document.createElement("button");
        modificarBtn.textContent = "Editar";
        modificarBtn.className = "btn-table btn-warning";
        modificarBtn.addEventListener("click", () => prepararEdicion(item));
        const eliminarBtn = document.createElement("button");
        eliminarBtn.textContent = "Borrar";
        eliminarBtn.className = "btn-table btn-danger";
        eliminarBtn.addEventListener("click", () => borrarConductor(item.id));
        accionesTd.appendChild(modificarBtn);
        accionesTd.appendChild(eliminarBtn);
        tr.appendChild(docTd);
        tr.appendChild(nombreTd);
        tr.appendChild(licenciaTd);
        tr.appendChild(estadoTd);
        tr.appendChild(accionesTd);

        tbody.appendChild(tr);
    }
};
const consultarConductores = async () => {
    try {
        if (conductores.length > 0) {
            conductores.splice(0, conductores.length);
        }
        const response = await fetch("http://127.0.0.1:8002/conductores");
        const body = await response.json();
        body.forEach((item) => {
            conductores.push({
                id: item.id,
                nombres: item.nombres,
                apellidos: item.apellidos,
                documento: item.documento,
                telefono: item.telefono,
                correo: item.correo,
                num_licencia: item.num_licencia,
                categoria: item.categoria,
                fecha_vencimiento: item.fecha_vencimiento,
                estado: item.estado
            });
        });
        mostrarConductores();
    } catch (ex) {
        console.error("Error en el servicio de conductores:", ex);
    }
};
const borrarConductor = async (id) => {
    try {
        const response = await fetch("http://127.0.0.1:8002/conductores/" + id, {
            method: "DELETE"
        });
        if (response.status == 200) {
            showModal("Conductor eliminado exitosamente.", "ok");
            consultarConductores(); 
        }
    } catch (ex) {
        console.error("Error al conectar con el servicio:", ex);
        showModal("No se pudo eliminar el conductor.", "error");
    }
};
consultarConductores();