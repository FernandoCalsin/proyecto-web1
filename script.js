// Abrir y cerrar overlays
function abrirOverlay(overlayId) {
  document.getElementById(overlayId).style.width = "100%";
}
function cerrarOverlay(overlayId) {
  document.getElementById(overlayId).style.width = "0";
}

document.addEventListener("DOMContentLoaded", () => {
  
  const formRegistro = document.querySelector("#overlay-suscribete form.login-form");
  const formLogin = document.querySelector("#overlay-contactanos form.contact-form");

  // Registro
  formRegistro.addEventListener("submit", function(e) {
    e.preventDefault();
    let email = formRegistro.querySelector("input[type='email']").value;
    let pass = formRegistro.querySelector("input[type='password']").value;

    if(localStorage.getItem(email)) {
      alert("Este correo ya está registrado. Inicie sesión.");
      return;
    }

    localStorage.setItem(email, pass);
    alert("Registrado con éxito. Ahora puedes iniciar sesión.");
    cerrarOverlay('overlay-suscribete');
  });
  formLogin.addEventListener("submit", function(e) {
    e.preventDefault();
    let email = formLogin.querySelector("input[type='email']").value;
    let pass = formLogin.querySelector("input[type='text'], input[type='password']").value ?? "";

    let passwordGuardada = localStorage.getItem(email);

    if(passwordGuardada === pass) {
      alert("✅ Sesión iniciada correctamente!");
      cerrarOverlay('overlay-contactanos');
    } else {
      alert("Correo o contraseña incorrectos");
    }
  });
});
