// Función genérica para abrir CUALQUIER overlay por su ID
function abrirOverlay(overlayId) {
  document.getElementById(overlayId).style.width = "100%";
}

// Función genérica para cerrar CUALQUIER overlay por su ID
function cerrarOverlay(overlayId) {
  document.getElementById(overlayId).style.width = "0";
}