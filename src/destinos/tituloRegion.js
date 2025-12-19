const archivo = window.location.pathname.split("/").pop().replace(".html", "");
const titulo = archivo.charAt(0).toUpperCase() + archivo.slice(1);

document.addEventListener("DOMContentLoaded", () => {
    document.title = titulo + " - Turismo";

    const h1 = document.getElementById("titulo");
    if (h1) h1.textContent = titulo;

    const h2 = document.getElementById("titulo2");
    if (h2) h2.textContent = titulo;
});
