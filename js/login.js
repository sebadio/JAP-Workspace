// Funcion que valida el email
const validateEmail = (email) => {
  // Chequeamos si el email tiene valor, si incluye el caracter "@" y si incluye ".com" dentro de el
  if (
    email.value &&
    email.value.includes("@") &&
    email.value.includes(".com")
  ) {
    // Si es asi le añadimos la clase de bootstrap "is-valid" para que nos muestre que lo hicimos correctamente
    if (email.classList.contains("is-invalid")) {
      // Antes de eso chequeamos si ya tenia la clase "is-invalid" previamente y si asi es se la quitamos
      email.classList.replace("is-invalid", "is-valid");
    }
    email.classList.add("is-valid");

    // La funcion entonces retorna Verdadero
    return true;
  } else {
    // Si alguna de las validaciones falla, le añadimos la clase "is-invalid" para hacerle saber al usuario que su email no es correcto

    if (email.classList.contains("is-valid")) {
      // Aca hacemos a la inversa que antes y checkeamos si tiene la clase "is-valid" y si es asi se la quitamos
      email.classList.remove("is-valid");
    }
    email.classList.add("is-invalid");

    // La funcion retorna false
    return false;
  }
};

// Funcion que valida la contraseña
const validatePassword = (password) => {
  // Checkeamos si hay una contraseña
  if (password.value && password.value !== "") {
    // Si es asi chekeamos la clase "is-invalid" y si la tiene se la quitamos
    if (password.classList.contains("is-invalid")) {
      password.classList.remove("is-invalid");
    }

    // Agregamos la clase "is-valid"
    password.classList.add("is-valid");

    // La funcion retorna true
    return true;
  } else {
    // Si falla la validacion le agregamos la clase "is-invalid" y si tiene la clase "is-valid" se la quitamos
    if (password.classList.contains("is-valid")) {
      password.classList.remove("is-valid");
    }

    password.classList.add("is-invalid");

    // La funcion retorna false
    return false;
  }
};

const redirect = (email, user = null) => {
  localStorage.setItem("user", String(user ? user : email));

  setInterval(() => {
    location.href = "portada.html";
  }, 1500);
};

// Window.onload espera a que la pagina cargue para ejecutar sus instrucciones
window.onload = () => {
  // Creamos la constante boton y agregamos un eventListener para saber cuando clickea el usuario
  const boton = document.getElementById("loginButton");

  boton.addEventListener("click", () => {
    // Cuando el boton es clickeado creamos dos constantes que extraen los dos input

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Hacemos una validacion, si ambas funciones antes definidas retornan true, el usuario es redireccionado a la portada, de lo contrario debera ingresar de vuelta sus credenciales
    if (validateEmail(emailInput) && validatePassword(passwordInput)) {
      passwordInput.disabled = true;
      emailInput.disabled = true;
      boton.disabled = true;
      boton.innerHTML = "Redireccionando...";

      redirect(emailInput.value);
    }
  });
};

function decodeGoogleResponse(respuesta) {
  var base64Url = respuesta.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function handleGSignIn(respuesta) {
  const data = decodeGoogleResponse(respuesta.credential);

  const midCol = document.getElementById("midCol");
  midCol.classList.add("d-flex");
  midCol.classList.add("flex-column");
  midCol.classList.add("justify-content-center");
  midCol.classList.add("align-items-center");

  midCol.innerHTML = `
    <h2 class="w-100 text-center">Iniciaste sesión con Google</h2>
    <img src="${data.picture}" class="img-fluid rounded-circle">
    <span>${data.name}</span>
    <span>${data.email}</span>
    <span class="p-2">Estas siendo redireccionado por favor espere</span>
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;

  redirect(data.email, data.name);
}
