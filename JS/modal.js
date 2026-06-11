function showModal(message, type = "error") {
    const mensajeError = document.getElementById("mensaje-error");
    if (!mensajeError) {
        alert(message);
        return;
    }

    mensajeError.textContent = message;
    mensajeError.classList.remove("hidden", "error", "exito");
    mensajeError.classList.add(type === "ok" ? "exito" : "error");

    setTimeout(() => {
        mensajeError.classList.add("hidden");
    }, 3500);
}
