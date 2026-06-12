
const conductorForm = document.forms["conductorForm"];
const getConductorForm = () => {
    return {
        nombres: conductorForm["nombres"].value.trim(),
        apellidos: conductorForm["apellidos"].value.trim(),
        documento: conductorForm["documento"].value.trim(),
        telefono: conductorForm["telefono"].value.trim(),
        correo: conductorForm["correo"].value.trim(),
        num_licencia: conductorForm["num_licencia"].value.trim(),
        categoria: conductorForm["categoria"].value.trim(),
        fecha_vencimiento: conductorForm["fecha_vencimiento"].value,
        estado: conductorForm["estado"].value
    };
};
const setConductorForm = (data) => {
    conductorForm["nombres"].value = data.nombres;
    conductorForm["apellidos"].value = data.apellidos;
    conductorForm["documento"].value = data.documento;
    conductorForm["telefono"].value = data.telefono;
    conductorForm["correo"].value = data.correo;
    conductorForm["num_licencia"].value = data.num_licencia;
    conductorForm["categoria"].value = data.categoria;
    conductorForm["fecha_vencimiento"].value = data.fecha_vencimiento;
    conductorForm["estado"].value = data.estado;
};
const registrarConductor = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8001/conductores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getConductorForm())
        });
        const body = await response.json();
        
        if (response.status == 201) {
            showModal("Conductor registrado con éxito.", "ok");
            consultarConductores(); 
            conductorForm.reset();
        } else {
            showModal(body.error || "Error al guardar los datos.", "error");
        }
    } catch (ex) {
        showModal("Error de conexión con el servidor.", "error");
    }
};
const actualizarConductor = async () => {
    try {
        const id = conductorSeleccionado.id; 
        const response = await fetch("http://127.0.0.1:8001/conductores/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getConductorForm())
        });
        const body = await response.json();
        
        if (response.status == 200) {
            showModal("Información del conductor actualizada.", "ok");
            consultarConductores();
            conductorSeleccionado = null; 
            conductorForm.reset();
            conductorForm.getElementsByTagName("button")[0].textContent = "Guardar Conductor";
        } else {
            showModal(body.error || "Error al actualizar.", "error");
        }
    } catch (ex) {
        showModal("Error de conexión con el servidor.", "error");
    }
};
const validarInputs = (formData) => {
    const msgInputDoc = document.getElementById("msgInputDoc");
    if (!formData.documento) {
        msgInputDoc.style.display = "block";
    } else {
        msgInputDoc.style.display = "none";
    }
};
conductorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const currentValues = getConductorForm();
    
    validarInputs(currentValues);
    if (!currentValues.nombres || !currentValues.apellidos || !currentValues.documento || 
        !currentValues.num_licencia || !currentValues.fecha_vencimiento) {
        showModal("Por favor complete todos los campos obligatorios.", "error");
        return;
    }
    conductorSeleccionado ? actualizarConductor() : registrarConductor();
});
conductorForm.addEventListener("reset", () => {
    conductorSeleccionado = null;
    conductorForm.getElementsByTagName("button")[0].textContent = "Guardar Conductor";
});
conductorForm["documento"].addEventListener("keyup", () => {
    validarInputs(getConductorForm());
});
const prepararEdicion = (item) => {
    conductorSeleccionado = item; 
    setConductorForm(conductorSeleccionado); 
    conductorForm.getElementsByTagName("button")[0].textContent = "Actualizar Información";
};