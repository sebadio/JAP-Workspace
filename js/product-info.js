// Agarramos el productId para los fetch necesarios
const productId = localStorage.getItem("productId");

// Funcion que nos ayuda a settear la id para redirigirnos
const redirect = (id) => {
  localStorage.setItem("productId", id);
};

// Fetch Productos
const fetchProduct = async () => {
  const url = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
  const respuesta = await fetch(url);

  const data = respuesta.json();

  return data;
};

// Fetch Comentarios
const fetchComments = async () => {
  const url = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;
  const respuesta = await fetch(url);

  const data = respuesta.json();

  return data;
};

// Funcion que agrega los comentarios
const poblarComentarios = async () => {
  const comentarios = await fetchComments();

  document.getElementById(
    "comentarios"
  ).innerHTML = `<ul class="list-group" id="comentariosUl"></ul>`;

  // Mostramos una alerta o los
  if (comentarios.length === 0) {
    document.getElementById(
      "comentariosUl"
    ).innerHTML = `<div id="noComment" class="text-center alert-secondary p-4 rounded-3">Este producto no tiene comentarios, ¡pero tu podrias ser ser el primero!</div>`;
  } else {
    for (let i = 0; i < comentarios.length; i++) {
      const element = comentarios[i];

      document.getElementById("comentarios").innerHTML += `
    
        <li class="list-group-item">
            <div class="d-flex gap-2"><span><strong>${element.user}</strong></span> - <div id="stars${i}"></div> <span><small>${element.dateTime}</small></span></div>
            <div>${element.description}</div>
        </li>
        `;

      for (let x = 0; x < 5; x++) {
        document.getElementById(`stars${i}`).innerHTML +=
          x < element.score
            ? `<span class="fa fa-star checked"></span>`
            : `<span class="fa fa-star"></span>`;
      }
    }
  }
};

// Funcion que crea y agrega nuestro comentario
const comentar = () => {
  const comentarioTexto = document.getElementById("comentarioTexto").value;
  const puntuacion = Number(document.getElementById("puntuacion").value);
  const date = new Date();
  const time = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  if (document.getElementById("noComment")) {
    document.getElementById("noComment").parentElement.innerHTML = "";
  }

  document.getElementById("comentariosUl").innerHTML += `
    <li id="ownComment" class="list-group-item transition active">
        <div class="d-flex gap-2"><span><strong>${localStorage.getItem(
          "user"
        )}</strong></span> - <div id="starsOwnComment"></div> <span>${time}</span></div>
        <div>${comentarioTexto}</div>
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

// Funcion que modifica el container para mostrar la info del producto seleccionado
const poblar = async () => {
  const {
    name,
    images,
    description,
    currency,
    category,
    cost,
    soldCount,
    relatedProducts,
  } = await fetchProduct();

  const contenedor = document.getElementById("container");

  contenedor.style.marginTop = "2rem";

  contenedor.innerHTML = `
  <h1>${name}</h1>
  <hr />
  
  <div class="row">
    <div class="col-7">
      <div id="productCarousel" class="carousel slide" data-bs-ride="true">
        <div id="carouselIndicators" class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#productCarousel"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
        </div>
        <div id="carouselImages" class="carousel-inner">
          <div class="carousel-item active">
            <img src="${images[0]}" class="d-block w-100" alt="..." />
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#productCarousel"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#productCarousel"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  
    <div class="col-5">
      <h4>Precio <span></span></h4>
      <p>${currency} ${cost}</p>
  
      <h4>Descripción</h4>
      <p>${description}</p>
  
      <h4>Categoria</h4>
      <p>${category}</p>
      <br />
  
      <h4>Cantidad de vendidos</h4>
      <p>${soldCount}</p>
      <br />
    </div>
  </div>
  
  <hr >

  <div class="my-5 row">
    <h2>Comentarios</h2>
    <div id="comentarios" class="container">
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
  
  <div class="row my-5">
    <div class="col-6">
      <h3>Comentar</h3>
      <div id="formComment" class="d-flex flex-column">
        <p class="mt-3 mb-1">Tu opinión:</p>
        <textarea
          class="form-control"
          name=""
          id="comentarioTexto"
          cols="30"
          rows="10"
        ></textarea>
        <p class="mt-3 mb-1">Tu puntuación:</p>
        <select id="puntuacion" class="form-select" style="width: min-content;" aria-label="Default select example">
          <option selected>Su puntuación</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button class="btn btn-primary mt-3 mb-1" style="width: min-content;" type="button" onclick="comentar()">
          Enviar
        </button>
      </div>
    </div>
    <div class="col-3"></div>
    <div class="col-3"></div>
  </div>

  <hr >
  
  <div class="row mt-4">
    <h2>Productos Relacionados</h2>
    <div class="container d-flex gap-4" id="related"></div>
  </div>
  `;

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

  for (let i = 0; i < relatedProducts.length; i++) {
    const element = relatedProducts[i];

    document.getElementById("related").innerHTML += `    
    <div class="card" style="width: 18rem;">
        <img src="${element.image}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${element.name}</h5>
            <a href="product-info.html" onclick="redirect(${element.id})" class="btn btn-primary">Ver Producto</a>
        </div>
    </div>`;
  }

  // Llamamos a la funcion para poblar los comentarios
  poblarComentarios();
};

// Llamamos a la funcion de poblar
poblar();
