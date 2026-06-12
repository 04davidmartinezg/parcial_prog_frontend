const API_URL = "http://127.0.0.1:8003/vehiculo"; 
const tablaBody = document.getElementById("tablaVehiculosBody");
const formVehiculo = document.getElementById("formVehiculo");
const obtenerVehiculos = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener datos.");
        
        const vehiculos = await response.json();
        tablaBody.innerHTML = ""; 

        if (vehiculos.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #a5a5a5;">No hay vehículos registrados.</td></tr>`;
            return;
        }
        vehiculos.forEach(vehiculo => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${vehiculo.placa}</strong></td>
                <td>${vehiculo.marca}</td>
                <td>${vehiculo.modelo}</td>
                <td>${vehiculo.capacidad} Ton</td>
                <td>
                    <button class="btn btn-primary" style="padding: 5px 10px; font-size: 12px; margin-right: 5px;" onclick="cargarVehiculoEdicion(${JSON.stringify(vehiculo).replace(/"/g, '&quot;')})">✏️</button>
                </td>
            `;
            tablaBody.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
        tablaBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ff4d4d;">Error al conectar con el servidor.</td></tr>`;
    }
};
const guardarVehiculo = async (e) => {
    e.preventDefault();
    const id = document.getElementById("vehiculoId").value;
    const placa = document.getElementById("placa").value.trim();
    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const capacidad = document.getElementById("capacidad").value.trim();
    if (!placa || !marca || !modelo || !capacidad) {
        showModal("Por favor complete todos los campos obligatorios.", "error");
        return;
    }
    const datosVehiculo = { placa, marca, modelo: parseInt(modelo), capacidad: parseFloat(capacidad) };
    try {
        const urlFinal = id ? `${API_URL}/${id}` : API_URL;
        const metodo = id ? "PUT" : "POST"; 

        const response = await fetch(urlFinal, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosVehiculo)
        });

        if (response.ok) {
            showModal(id ? "¡Vehículo actualizado correctamente!" : "¡Vehículo registrado con éxito!", "ok");
            formVehiculo.reset();
            document.getElementById("vehiculoId").value = "";
            document.getElementById("form-title").textContent = "Registrar Vehículo";
            document.getElementById("btnCancelar").classList.add("hidden");
            obtenerVehiculos(); 
        } else {
            const errorData = await response.json();
            showModal(errorData.error || "No se pudo procesar la solicitud.", "error");
        }
    } catch (error) {
        console.error(error);
        showModal("Error crítico al comunicar con el servidor.", "error");
    }
};
window.cargarVehiculoEdicion = (vehiculo) => {
    document.getElementById("vehiculoId").value = vehiculo.id;
    document.getElementById("placa").value = vehiculo.placa;
    document.getElementById("marca").value = vehiculo.marca;
    document.getElementById("modelo").value = vehiculo.modelo;
    document.getElementById("capacidad").value = vehiculo.capacidad;

    document.getElementById("form-title").textContent = "Editar Vehículo 🚚";
    document.getElementById("btnCancelar").classList.remove("hidden");
};
document.getElementById("btnCancelar").addEventListener("click", () => {
    formVehiculo.reset();
    document.getElementById("vehiculoId").value = "";
    document.getElementById("form-title").textContent = "Registrar Vehículo";
    document.getElementById("btnCancelar").classList.add("hidden");
});
formVehiculo.addEventListener("submit", guardarVehiculo);
document.addEventListener("DOMContentLoaded", obtenerVehiculos);