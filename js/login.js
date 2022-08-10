const validateEmail = (email) => {
  if (
    email.value &&
    email.value.includes("@") &&
    email.value.includes(".com")
  ) {
    if (email.classList.contains("is-invalid")) {
      email.classList.replace("is-invalid", "is-valid");
    }
    email.classList.add("is-valid");

    return true;
  } else {
    if (email.classList.contains("is-valid")) {
      email.classList.remove("is-valid");
    }
    email.classList.add("is-invalid");

    return false;
  }
};

const validatePassword = (password) => {
  if (password.value && password.value !== "") {
    if (password.classList.contains("is-invalid")) {
      password.classList.remove("is-invalid");
    }
    password.classList.add("is-valid");
    return true;
  } else {
    if (password.classList.contains("is-valid")) {
      password.classList.remove("is-valid");
    }

    password.classList.add("is-invalid");
    return false;
  }
};

window.onload = () => {
  const boton = document.getElementById("loginButton");

  boton.addEventListener("click", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (validateEmail(emailInput) && validatePassword(passwordInput)) {
      passwordInput.disabled = true;
      emailInput.disabled = true;
      boton.disabled = true;

      setInterval(() => {
        location.href = "portada.html";
      }, 1500);
    }
  });
};
