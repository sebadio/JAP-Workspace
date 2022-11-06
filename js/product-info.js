// Agarramos el productId para los fetch necesarios
const productId = localStorage.getItem("productId");

// Funcion que nos ayuda a settear la id para redirigirnos
const redirect = (id) => {
  localStorage.setItem("productId", id);
};

// Funcion que extrae los datos del producto y sus comentarios
const fetchFunction = async () => {
  try {
    const product = await fetch(
      `https://japceibal.github.io/emercado-api/products/${productId}.json`
    );
    const comentarios = await fetch(
      `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`
    );

    if (product.ok) {
      const productData = await product.json();
      if (comentarios.ok) {
        const comentarioData = await comentarios.json();
        return {
          ...productData,
          comentarioData,
        };
      } else {
        return {
          ...productData,
          comentarioData: "error",
        };
      }
    } else {
      return {
        name: null,
        images: null,
        description: null,
        currency: null,
        category: null,
        cost: null,
        soldCount: null,
        relatedProducts: null,
        comentarioData: null,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      name: null,
      images: null,
      description: null,
      currency: null,
      category: null,
      cost: null,
      soldCount: null,
      relatedProducts: null,
      comentarioData: null,
    };
  }
};

// Funcion que agrega los comentarios
const poblarComentarios = async (comentarioData) => {
  // Mostramos una alerta o los comentarios, segun si el producto los tiene o no
  if (comentarioData.length === 0 || comentarioData === null) {
    document.getElementById(
      "comentarios"
    ).innerHTML = `<div id="noComment" class="text-center alert-secondary p-4 rounded-3">Este producto no tiene comentarios, ¡pero tu podrias ser ser el primero!</div>`;
  } else {
    document.getElementById(
      "comentarios"
    ).innerHTML = `<ul class="list-group" id="comentariosUl"></ul>`;

    const comentarios = document.getElementById("comentariosUl");

    for (let i = 0; i < comentarioData.length; i++) {
      const element = comentarioData[i];

      comentarios.innerHTML += `
        <li class="list-group-item">
            <div class="row">
              <div class="row">
                <div class="col-auto p-1">
                  <strong>${element.user}</strong>
                </div>
                <div class="col-auto p-1 d-sm-none d-md-block">-</div>
                <div class="col-auto p-1" id="stars${i}"></div>
                <div class="col-auto p-1 d-sm-none d-md-block">-</div>
                <small class="col-auto p-1">${element.dateTime}</small>
              </div>
              <div class="row mt-2">
                <p class="p-0 m-0 ms-2">${element.description}</p>
              </div>
            </div>
        </li>
        `;

      /* Agregamos las estrellas al comentario */
      for (let x = 0; x < 5; x++) {
        document.getElementById(`stars${i}`).innerHTML +=
          x < element.score
            ? `<span class="fa fa-star checked"></span>`
            : `<span class="fa fa-star"></span>`;
      }
    }
  }
};

// Funcion que extrae la fecha y hora actual para ponerla en el comentario
const getDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

// Funcion que crea y agrega nuestro comentario
const comentar = () => {
  const user = JSON.parse(localStorage.getItem(localStorage.getItem("user")));

  const comentarioTexto = document.getElementById("comentarioTexto").value;
  const puntuacion = Number(document.getElementById("puntuacion").value);
  const time = getDate();

  // If que impide enviar una puntuacion no valida
  if (document.getElementById("puntuacion").value === "Su puntuación") {
    const invalid = document.createElement("p");
    invalid.innerText = "Por favor ingrese una puntuación valida";
    invalid.classList.add("text-danger");
    invalid.classList.add("fw-bold");
    invalid.classList.add("mt-3");
    document.getElementById("formComment").appendChild(invalid);

    document.getElementById("puntuacion").classList.add("border-danger");
    return;
  }

  if (document.getElementById("noComment")) {
    document.getElementById("noComment").parentElement.innerHTML = "";
  }

  if (!document.getElementById("comentariosUl")) {
    document.getElementById(
      "comentarios"
    ).innerHTML = `<ul class="list-group" id="comentariosUl"></ul>`;
  }

  document.getElementById("comentariosUl").innerHTML += `
  <li id="ownComment" class="list-group-item transition active">
    <div class="row">
      <div class="row">
        <div class="col-auto p-1">
          <strong>${
            user.firstName
              ? user.firstName + " " + user.firstLastName
              : user.email
          }</strong>
        </div>
        <div class="col-auto p-1 d-sm-none d-md-block">-</div>
        <div class="col-auto p-1" id="starsOwnComment"></div>
        <div class="col-auto p-1 d-sm-none d-md-block">-</div>        
        <small class="col-auto p-1">${time}</small>
      </div>
      <div class="row mt-2">
          <p class="p-0 m-0 ms-2">${comentarioTexto}</p>
      </div>
    </div>
  </li>
  `;

  for (let i = 0; i < 5; i++) {
    document.getElementById(`starsOwnComment`).innerHTML +=
      i < puntuacion
        ? `<span class="fa fa-star checked"></span>`
        : `<span class="fa fa-star"></span>`;
  }

  document.getElementById("formComment").innerHTML = `
    <div class="text-center form-control">
        ¡Gracias por su comentario!
    </div>
  `;

  setTimeout(() => {
    document.getElementById("ownComment").classList.remove("active");
  }, 1500);

  setTimeout(() => {
    document.getElementById("ownComment").classList.remove("transition");
  }, 1600);
};

// Funcion que nos previene el enviar nuestro comentario sin una puntuacion
const formListener = () => {
  document.getElementById("puntuacion").addEventListener("change", () => {
    document.getElementById("form-button").classList.remove("disabled");
    document.getElementById("form-button").disabled = false;
  });
};

// Funcion que modifica el container para mostrar la info del producto seleccionado
const poblar = async () => {
  const {
    id,
    name,
    images,
    description,
    currency,
    category,
    cost,
    soldCount,
    relatedProducts,
    comentarioData,
  } = await fetchFunction();

  // Chequeamos si hubo un error en el fetch y si lo hubo mostramos una alerta

  if (name === null && description === null && images === null) {
    document.getElementById("container").innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        Hubo un problema, por favor intente mas tarde.
      </div>
    `;
    return;
  }

  /* Agregamos los datos a la pagina */
  document.getElementById(
    "category"
  ).innerHTML = `${category} > <span style="font-weight: 600;">${name}</span>`;
  document.getElementById("firstCarouselImage").src = images[0];
  document.getElementById("soldCount").innerHTML += soldCount;
  document.getElementById("productName").innerHTML = name;
  document.getElementById("currency").innerHTML = currency;
  document.getElementById("cost").innerHTML = cost;
  document.getElementById("addToCart").addEventListener("click", () => {
    handleAddToCart(id, name, cost, currency, images[0]);
  });
  document.getElementById("description").innerHTML = description;

  /* Agregamos las imagenes restantes al carousel */
  for (let i = 1; i < images.length; i++) {
    const element = images[i];

    document.getElementById("carouselImages").innerHTML += `
      <div class="carousel-item">
          <img src="${element}" class="d-block w-100" alt="...">
      </div>
    `;

    document.getElementById("carouselIndicators").innerHTML += `
      <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="${i}" aria-label="Slide ${
      i + 1
    }"></button>
    `;
  }

  /* Agregamos los productos relacionados */
  for (let i = 0; i < relatedProducts.length; i++) {
    const element = relatedProducts[i];

    document.getElementById("related").innerHTML += `    
      <div class="card" style="width: 18rem;">
          <img src="${element.image}" class="card-img-top" alt="imagen de ${element.name}">
          <div class="card-body">
              <h5 class="card-title">${element.name}</h5>
              <a href="product-info.html" onclick="redirect(${element.id})" class="btn btn-primary">Ver Producto</a>
          </div>
      </div>
    `;
  }

  // Llamamos a la funcion para poblar los comentarios
  poblarComentarios(comentarioData);
  formListener();
  checkIfAlreadyOnList(id);
};

const handleAddToCart = (id, name, costo, currency, imagen) => {
  const user = JSON.parse(localStorage.getItem(localStorage.getItem("user")));

  if (user.cart) {
    if (user.cart[id]) {
      document.getElementById("container").innerHTML += `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Este articulo ya esta en tu carrito
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      return;
    }
  }

  localStorage.setItem(
    user.email,
    JSON.stringify({
      ...user,
      cart: {
        ...user.cart,
        [id]: {
          id,
          name,
          costo,
          currency,
          imagen,
          count: 1,
        },
      },
    })
  );

  document.getElementById("container").innerHTML += `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      ¡Articulo agregado al carrito correctamente!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  document.getElementById("addToCart").setAttribute("disabled", "true");
  document.getElementById("addToCart").innerHTML =
    "Articulo ya esta en el carrito";
};

const checkIfAlreadyOnList = (id) => {
  const cart = JSON.parse(
    localStorage.getItem(localStorage.getItem("user"))
  ).cart;

  if (cart) {
    if (cart[id]) {
      document.getElementById("addToCart").setAttribute("disabled", "true");
      document.getElementById("addToCart").innerHTML =
        "Articulo ya esta en el carrito";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Llamamos a la funcion de poblar
  poblar();
});
