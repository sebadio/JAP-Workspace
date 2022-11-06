/* Creamos una variable para guardar mas tarde la imagen */
let imagenSubida;

/* Esperamos a que cargue la pagina */
document.addEventListener("DOMContentLoaded", () => {
  /* Agarramos el usuario */
  const userName = localStorage.getItem("user");
  const user = JSON.parse(localStorage.getItem(userName));

  /* Checkeamos si el usuario tiene una imagen o si tenemos que colocar la imagen default */
  document.getElementById("profileImage").src = user.profilePicture
    ? user.profilePicture
    : "./img/img_perfil.png";

  /* Actualizamos la imagen cada vez que cambia */
  document.getElementById("fotoPerfil").addEventListener("change", () => {
    const image = document.getElementById("fotoPerfil").files[0];

    const lector = new FileReader();
    lector.onloadend = () => {
      document.getElementById("profileImage").src = lector.result;
      imagenSubida = lector.result;
    };
    lector.readAsDataURL(image);
  });

  /* Ponemos los datos existentes en los inputs */

  document.getElementById("firstName").value = user.firstName;
  document.getElementById("secondName").value = user.secondName;
  document.getElementById("firstLastName").value = user.firstLastName;
  document.getElementById("secondLastName").value = user.secondLastName;
  document.getElementById("telefono").value = user.tel;
  document.getElementById("email").value = user.email;

  /* Agarramos el formulario y le agregamos el event listener */
  const form = document.getElementById("formulario");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.classList.contains("was-validated")) {
      form.classList.add("was-validated");
    }

    if (form.checkValidity()) {
      const firstName = document.getElementById("firstName").value,
        secondName = document.getElementById("secondName").value,
        firstLastName = document.getElementById("firstLastName").value,
        secondLastName = document.getElementById("secondLastName").value,
        tel = document.getElementById("telefono").value,
        email = document.getElementById("email").value,
        profilePicture =
          imagenSubida || document.getElementById("profileImage").src;

      const user = {
        firstName,
        secondName,
        firstLastName,
        secondLastName,
        tel,
        email,
        profilePicture,
      };

      /* Borramos la cuenta anterior y  */
      localStorage.removeItem(localStorage.getItem("user"));
      localStorage.setItem("user", email);
      localStorage.setItem(`${email}`, JSON.stringify(user));
    }
  });
});
