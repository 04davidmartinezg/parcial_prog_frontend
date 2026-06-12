const modalContenedor = document.getElementById("modal1");
const modalTexto = modalContenedor ? modalContenedor.querySelector(".modal-content p") : null;
const modalBotonCerrar = modalContenedor ? modalContenedor.querySelector(".btn-modal-close") : null;

/**

  @param {string} mensaje 
  @param {string} tipo 
 */
function showModal(mensaje, tipo) {
    if (!modalContenedor || !modalTexto || !modalBotonCerrar) {
        console.error("No se encontraron los elementos HTML de la modal.");
        return;
    }
    modalTexto.textContent = mensaje;
    if (tipo === "error") {
        modalTexto.style.color = "#ff4d4d"; 
        modalBotonCerrar.style.backgroundColor = "#ff4d4d"; 
        modalBotonCerrar.style.color = "#ffffff";
    } else {
        modalTexto.style.color = "#48cae4"; 
        modalBotonCerrar.style.backgroundColor = "#48cae4"; 
        modalBotonCerrar.style.color = "#0b132b"; 
    }
    modalContenedor.classList.remove("close");
}
function hideModal() {
    if (modalContenedor) {
        modalContenedor.classList.add("close"); 
    }
}
if (modalBotonCerrar) {
    modalBotonCerrar.addEventListener("click", hideModal);
}