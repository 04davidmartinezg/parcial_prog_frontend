
document.addEventListener("DOMContentLoaded", () => {
    const usuarioId = localStorage.getItem("usuarioId");

    if (!usuarioId) {
        window.location.href = "login.html";
        return;
    }
    const nombreUsuario = localStorage.getItem("nombre") || "Usuario";
    const txtBienvenida = document.getElementById("bienvenida-usuario");
    
    if (txtBienvenida) {
        txtBienvenida.textContent = `¡Bienvenido de nuevo, ${nombreUsuario}!`;
    }
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", (e) => {
            e.preventDefault(); 
            localStorage.clear(); 
            window.location.href = "login.html";
        });
    }
});