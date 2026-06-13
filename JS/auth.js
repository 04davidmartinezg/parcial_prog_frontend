const URL_AUTH = "http://127.0.0.1:8000"; 

const iniciarSesion = async (usernameOrEmail, contrasena) => {
    try {
        const response = await fetch(`${URL_AUTH}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username_or_email: usernameOrEmail,
                contrasena: contrasena
            })
        });
        const body = await response.json();
        if (response.ok) {
            localStorage.setItem("usuarioId", body.id);
            localStorage.setItem("nombre", body.nombre || usernameOrEmail);

            showModal("Inicio de sesión exitoso. Bienvenido.", "ok");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);
        } else {
            showModal(body.error || "Credenciales incorrectas. Intente de nuevo.", "error");
        }
    } catch (ex) {
        showModal("Error de conexión con el servicio de autenticación.", "error");
    }
};

const validarSesionActiva = async () => {
    const userId = localStorage.getItem("usuarioId");

    if (!userId) {
        if (!window.location.pathname.endsWith("login.html")) {
            window.location.href = "login.html";
        }
        return;
    }

    try {
        const response = await fetch(`${URL_AUTH}/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: parseInt(userId) })
        });

        if (!response.ok) {
            localStorage.clear();
            if (!window.location.pathname.endsWith("login.html")) {
                window.location.href = "login.html";
            }
        }
    } catch (ex) {
        console.error("No se pudo verificar el estado de la sesión con el servidor.");
    }
};

const cerrarSesion = async () => {
    const userId = localStorage.getItem("usuarioId");

    if (!userId) {
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }
    try {
        const response = await fetch(`${URL_AUTH}/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: parseInt(userId) })
        });
        if (response.ok) {
            localStorage.clear();
            window.location.href = "login.html";
        } else {
            showModal("Error al procesar el cierre de sesión en el servidor.", "error");
        }
    } catch (ex) {
        localStorage.clear();
        window.location.href = "login.html";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("formLogin");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const userVal = document.getElementById("usuario").value.trim();
            const passVal = document.getElementById("contrasena").value;

            if (!userVal || !passVal) {
                showModal("Por favor rellene todos los campos.", "error");
                return;
            }
            iniciarSesion(userVal, passVal);
        });
    } else {
        validarSesionActiva();
    }

    const btnCerrarSesion = document.getElementById("btnCerrarSesion");
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    }
});