const conductores = [];
let conductorSeleccionado = null;
const conductoresTB = document.getElementById("conductoresTB");
const formConductor = document.getElementById("formConductor");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const titulo = document.getElementById("form-title");
const URL = "http://127.0.0.1:8001/conductor"; 
const getConductorForm = () => {
    return {
        nombres: document.getElementById("nombres").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        documento: document.getElementById("documento").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        numero_licencia: document.getElementById("numero_licencia").value.trim(),
        categoria_licencia: document.getElementById("categoria_licencia").value.trim(),
        fecha_vencimiento_licencia: document.getElementById("fecha_vencimiento_licencia").value,
        ...(conductorSeleccionado && { estado: document.getElementById("estado").value })
    };
};
const setConductorForm = (c) => {
    document.getElementById("nombres").value = c.nombres || "";
    document.getElementById("apellidos").value = c.apellidos || "";
    document.getElementById("documento").value = c.documento || "";
    document.getElementById("telefono").value = c.telefono || "";
    document.getElementById("correo").value = c.correo || "";
    document.getElementById("numero_licencia").value = c.numero_licencia || "";
    document.getElementById("categoria_licencia").value = c.categoria_licencia || "";
    document.getElementById("fecha_vencimiento_licencia").value = c.fecha_vencimiento_licencia || "";
    const selectEstado = document.getElementById("estado");
    if (selectEstado) {
        selectEstado.value = c.estado || "disponible";
    }
};
const mostrarConductores = () => {
    if (!conductoresTB) return;
    const tbody = conductoresTB.querySelector("tbody");
    tbody.innerHTML = "";  
    conductores.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.documento}</td>
            <td>${item.nombres} ${item.apellidos}</td>
            <td>${item.numero_licencia} (${item.categoria_licencia}) - ${item.fecha_vencimiento_licencia}</td>
            <td><strong>[${item.estado.toUpperCase()}]</strong></td>
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
const consultarConductores = async () => {
    try {
        conductores.length = 0;
        const response = await fetch(URL);
        const body = await response.json();
        body.forEach(item => {
            conductores.push({
                id: item.id,
                nombres: item.nombres,
                apellidos: item.apellidos,
                documento: item.documento,
                telefono: item.telefono,
                correo: item.correo,
                numero_licencia: item.numero_licencia,
                categoria_licencia: item.categoria_licencia,
                fecha_vencimiento_licencia: item.fecha_vencimiento_licencia,
                estado: item.estado || "disponible"
            });
        });
        mostrarConductores();
    } catch(ex){
        showModal("Error consultando la lista de conductores.", "error");
    }
};
const registrarConductor = async () => {
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getConductorForm())
        });
        if (response.ok) {
            showModal("Conductor registrado con éxito.", "ok");
            consultarConductores();
            formConductor.reset();
        } else {
            const body = await response.json();
            showModal(body.error || "Error al registrar el conductor.", "error");
        }
    } catch(ex){
        showModal("Error de conexión con el microservicio.", "error");
    }
};
const actualizarConductor = async () => {
    try {
        const response = await fetch(`${URL}/${conductorSeleccionado.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getConductorForm())
        });
        if (response.ok) {
            showModal("Datos del conductor actualizados.", "ok");
            consultarConductores();
            cancelarEdicion();
        } else {
            const body = await response.json();
            showModal(body.error || "Error al actualizar los datos.", "error");
        }
    } catch(ex){
        showModal("Error de conexión con el servidor.", "error");
    }
};
const prepararEdicion = (conductor) => {
    conductorSeleccionado = conductor;
    setConductorForm(conductor);
    if (titulo) titulo.textContent = "Editar Conductor";
    if (btnGuardar) btnGuardar.textContent = "Actualizar Datos";
    if (btnCancelar) btnCancelar.classList.remove("hidden");
    const groupEstado = document.getElementById("form-group-estado");
    if (groupEstado) groupEstado.classList.remove("hidden");
};
const cancelarEdicion = () => {
    conductorSeleccionado = null;
    if (formConductor) formConductor.reset();
    if (titulo) titulo.textContent = "Registrar Conductor";
    if (btnGuardar) btnGuardar.textContent = "Guardar Conductor";
    if (btnCancelar) btnCancelar.classList.add("hidden");
    const groupEstado = document.getElementById("form-group-estado");
    if (groupEstado) groupEstado.classList.add("hidden");
};
if (formConductor) {
    formConductor.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = getConductorForm();
        
        if (!data.nombres || !data.apellidos || !data.documento || !data.numero_licencia) {
            showModal("Los campos de identificación y licencia son estrictamente obligatorios.", "error");
            return;
        }
        conductorSeleccionado ? actualizarConductor() : registrarConductor();
    });
}
if (btnCancelar) {
    btnCancelar.addEventListener("click", cancelarEdicion);
}
document.addEventListener("DOMContentLoaded", () => {
    consultarConductores();
});