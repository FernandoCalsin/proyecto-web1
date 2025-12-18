// ===============================
// Abrir y cerrar overlays
// ===============================
function abrirOverlay(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) el.style.width = "100%";
}

function cerrarOverlay(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) el.style.width = "0";
}

// ===============================
// Registro, Login y Regiones dinámicas
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // --- Registro ---
  const formRegistro = document.querySelector("#overlay-suscribete form.login-form");
  if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = formRegistro.querySelector("input[type='email']")?.value.trim() || "";
      const pass = formRegistro.querySelector("input[type='password']")?.value.trim() || "";

      if (!email || !pass) {
        alert("Por favor completa todos los campos.");
        return;
      }
      if (localStorage.getItem(email)) {
        alert("Este correo ya está registrado. Inicie sesión.");
        return;
      }

      localStorage.setItem(email, pass);
      alert("Registrado con éxito. Ahora puedes iniciar sesión.");
      cerrarOverlay("overlay-suscribete");
    });
  }

  // --- Login ---
  const formLogin = document.querySelector("#overlay-login form.contact-form");
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = formLogin.querySelector("input[type='email']")?.value.trim() || "";
      const pass = formLogin.querySelector("input[type='password']")?.value.trim() || "";

      if (!email || !pass) {
        alert("Por favor completa todos los campos.");
        return;
      }

      const passwordGuardada = localStorage.getItem(email);
      if (passwordGuardada === pass) {
        alert("Sesión iniciada correctamente!");
        cerrarOverlay("overlay-login");
      } else {
        alert("Correo o contraseña incorrectos");
      }
    });
  }

  // --- Regiones dinámicas ---
  const params = new URLSearchParams(window.location.search);
  const region = params.get("region");

  if (region) {
    // IMPORTANTE: ajusta esta ruta según dónde esté tu archivo:
    // Si este script está dentro de destinos/infoRegiones/ y regiones.json está en la raíz,
    // la ruta correcta es "../../regiones.json"
    fetch("regiones.json")
      .then((res) => res.json())
      .then((data) => {
        const info = data[region];
        const elTitulo = document.getElementById("titulo");
        const elTitulo2 = document.getElementById("titulo2");
        const elDescripcion = document.getElementById("descripcion");

        if (!info) {
          // Exponer variable global indicando que no existe la región
          window.city = 'Región no encontrada';
          if (elTitulo) elTitulo.textContent = "Región no encontrada";
          if (elTitulo2) elTitulo2.textContent = "Región no encontrada";
          return;
        }

        // Exponer nombre legible de la ciudad/región
        window.city = info.titulo;

        document.title = info.titulo;
        if (elTitulo) elTitulo.textContent = info.titulo;
        if (elTitulo2) elTitulo2.textContent = info.titulo;
        if (elDescripcion && info.descripcion) elDescripcion.textContent = info.descripcion;

        // Información de ciudad (sección interna)
        const contenedor = document.getElementById("contenido-ciudad");
        if (contenedor && (info.infoCiudad || info.imagen)) {
          contenedor.innerHTML = `
            ${info.infoCiudad ? `<p>${info.infoCiudad}</p>` : ""}
            ${
              info.imagen
                ? `<img src="${info.imagen}" alt="Imagen de ${info.titulo}" style="max-width:100%; border-radius:8px;">`
                : ""
            }
          `;
        }
      })
      .catch((error) => {
        console.error("Error al cargar regiones.json:", error);
        // Limpiar variable global city en caso de error
        window.city = '';
        const elTitulo = document.getElementById("titulo");
        const elTitulo2 = document.getElementById("titulo2");
        if (elTitulo) elTitulo.textContent = "Error al cargar datos";
        if (elTitulo2) elTitulo2.textContent = "";
      });
  } else {
    // No hay parámetro 'region' en la URL
    window.city = '';
    const elTitulo = document.getElementById("titulo");
    const elTitulo2 = document.getElementById("titulo2");
    if (elTitulo) elTitulo.textContent = "Región no especificada";
    if (elTitulo2) elTitulo2.textContent = "";
  }
});

// ===============================
// Comentarios dinámicos
// ===============================
function comentar() {
  const textarea = document.getElementById("texto-comentario");
  const lista = document.getElementById("lista-comentarios");
  const comentario = textarea?.value.trim();

  if (!comentario) {
    alert("Por favor escribe un comentario antes de enviar.");
    return;
  }

  const nuevoComentario = document.createElement("p");
  nuevoComentario.textContent = comentario;
  if (lista) lista.appendChild(nuevoComentario);

  if (textarea) textarea.value = "";
}