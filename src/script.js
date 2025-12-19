// Abrir y cerrar overlays--------------------------------------------------------------------------------------------------------------
function abrirOverlay(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) el.classList.add("activo");
}

function cerrarOverlay(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) el.classList.remove("activo");
}

// Cerrar overlays con la tecla ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const overlays = document.querySelectorAll(".menu-overlay");
    overlays.forEach(overlay => {
      overlay.style.width = "0";
    });
  }
});
// Cerrar el overlay si hacen click fuera del contenido
document.querySelectorAll(".menu-overlay").forEach(overlay => {
  overlay.addEventListener("click", e => {
    if (e.target === overlay) {
      overlay.style.width = "0";
    }
  });
});
document.querySelectorAll(".contenido-menu").forEach(menu => {
  menu.addEventListener("click", e => {
    e.stopPropagation();
  });
});

// Registro, Login y Regiones dinámicas-------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
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

  // --- Login -------------------------------------------------------------------------------------------------------------------------------
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
  //Regiones dinámicas ---------------------------------------------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  const region = params.get("region");

  if (region) {
    fetch("regiones.json")
      .then((res) => res.json())
      .then((data) => {
        const info = data[region];
        const elTitulo = document.getElementById("titulo");
        const elTitulo2 = document.getElementById("titulo2");
        const elDescripcion = document.getElementById("descripcion");

        if (!info) {
          if (elTitulo) elTitulo.textContent = "Región no encontrada";
          if (elTitulo2) elTitulo2.textContent = "Región no encontrada";
          return;
        }

        document.title = info.titulo;
        if (elTitulo) elTitulo.textContent = info.titulo;
        if (elTitulo2) elTitulo2.textContent = info.titulo;
        if (elDescripcion && info.descripcion) elDescripcion.textContent = info.descripcion;

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
        const elTitulo = document.getElementById("titulo");
        if (elTitulo) elTitulo.textContent = "Error al cargar datos";
      });
  } else {
    const elTitulo = document.getElementById("titulo");
    const elTitulo2 = document.getElementById("titulo2");
    if (elTitulo) elTitulo.textContent = "Región no especificada";
    if (elTitulo2) elTitulo2.textContent = "";
  }
});
// Comentarios dinámicos---------------------------------------------------------------------------------------------------------------
function comentar() {
  const textarea = document.getElementById("texto-comentario");
  const lista = document.getElementById("lista-comentarios");
  const comentario = textarea?.value.trim();

  if (!comentario) {
    alert("Por favor escribe un comentario antes de enviar.");
    return;
  }
  fetch("/api/comentarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto: comentario })
  })
  .then(res => res.json())
  .then(data => {
    const nuevoComentario = document.createElement("p");
    nuevoComentario.textContent = data.texto;
    if (lista) lista.appendChild(nuevoComentario);
    if (textarea) textarea.value = "";
  })
  .catch(err => {
    console.error("Error al guardar comentario:", err);
    alert("Hubo un problema al guardar tu comentario.");
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-comentarios");
  fetch("/api/comentarios")
    .then(res => res.json())
    .then(data => {
      data.forEach(c => {
        const nuevoComentario = document.createElement("p");
        nuevoComentario.textContent = c.texto;
        lista.appendChild(nuevoComentario);
      });
    })
    .catch(err => console.error("Error al cargar comentarios:", err));
});
