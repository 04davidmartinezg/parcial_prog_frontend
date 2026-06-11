const formLogin = document.getElementById("formLogin");
const mensaje = document.getElementById("mensaje-error");

formLogin.addEventListener("submit", login);

async function login(e) {
    e.preventDefault();

    mensaje.className = "mensaje-alerta hidden";
    mensaje.textContent = "";

    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    if (!usuario || !contrasena) {
        mostrarError("Debe completar todos los campos.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username_or_email: usuario,
                contrasena: contrasena
            })
        });

        const body = await response.json();

        if (response.ok) {

            // Guardamos la sesión
            localStorage.setItem("usuarioId", body.id);
            localStorage.setItem("nombre", body.usuario.nombre);
            localStorage.setItem("rol", body.usuario.rol);

            // Redirigir al dashboard
            window.location.href = "dashboard.html";

        } else {
            mostrarError(body.error || "Credenciales incorrectas.");
        }

    } catch (error) {
        console.error(error);
        mostrarError("No fue posible conectar con el servidor.");
    }
}

function mostrarError(texto) {
    mensaje.textContent = texto;
    mensaje.className = "mensaje-alerta error";
}