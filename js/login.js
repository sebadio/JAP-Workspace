const redirect = (user) => {
  if (!localStorage.getItem(user.email)) {
    localStorage.setItem(`${user.email}`, JSON.stringify(user));
  }
  localStorage.setItem("user", user.email);

  setInterval(() => {
    location.href = "index.html";
  }, 1500);
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

  redirect({
    email: data.email,
    firstName: data.given_name,
    secondName: "",
    firstLastName: data.family_name,
    secondLastName: "",
    tel: "",
    profilePicture: data.picture,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.classList.contains("was-validated")) {
      form.classList.add("was-validated");
    }

    if (form.checkValidity()) {
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const boton = document.getElementById("loginButton");

      passwordInput.disabled = true;
      emailInput.disabled = true;
      boton.disabled = true;
      boton.innerHTML = "Redireccionando...";

      redirect({
        email: emailInput.value,
        firstName: "",
        secondName: "",
        firstLastName: "",
        secondLastName: "",
        tel: "",
        profilePicture: "",
      });
    }
  });
});
