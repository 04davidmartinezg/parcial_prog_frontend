const formLogin = document.getElementById("formLogin");
formLogin.addEventListener("submit", login);
async function login(e) {
    e.preventDefault(); 
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    if (!usuario || !contrasena) {
        showModal("Debe completar todos los campos.", "error");
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
            localStorage.setItem("usuarioId", body.id);
            localStorage.setItem("nombre", body.nombre || (body.usuario && body.usuario.nombre));
            localStorage.setItem("rol", body.rol || (body.usuario && body.usuario.rol));
            showModal("¡Inicio de sesión exitoso!", "ok");
            setTimeout(() => {
                window.location.href = "index.html"; 
            }, 1200);

        } else {
            showModal(body.error || "Credenciales incorrectas.", "error");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        showModal("No fue posible conectar con el servidor.", "error");
    }
}