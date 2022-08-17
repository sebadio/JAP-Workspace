// Esperamos a que se carguen los elementos del DOM:

window.onload = async () => {
  // Agarramos el div en el que se van a encontrar los productos:
  const container = document.getElementById("container");

  // Hacemos el fetch de los productos y extraemos los productos
  const url = `https://japceibal.github.io/emercado-api/cats_products/101.json`;

  const respuesta = await fetch(url);
  const datos = await respuesta.json();

  console.log(datos);

  const { products } = datos;

  // Modificamos el contenido del div para preparalo para los datos que vamos a recibir
  container.innerHTML = `
    <h2 class="fw-bold mt-4">Productos</h2>
    <br>
    <p>Aqui veras todos los productos de la categoria: ${datos.catName}</p>
    <ul id="lista" class="list-group w-100"></ul>
  `;

  // Agarramos la lista
  const lista = document.getElementById("lista");

  // Poblamos la lista con los productos y sus respectivas clases de Bootstrap
  products.map((producto) => {
    lista.innerHTML += `
    <li class="list-group-item w-100 d-flex flex-row p-2 justify-content-between">
        <div class="w-25 card p-1">
            <img class="img-fluid" src="${producto.image}" >
        </div>
        <div class="flex-fill ms-3" >
            <h2>${producto.name} - ${producto.currency}${producto.cost}</h2>
            <p>${producto.description}</p>
        </div>
        <div>
            <small>${producto.soldCount} Vendidos</small>
        </div>
    </li>`;
  });

  // A cada elemento lista le agregamos un eventListener que nos de los datos del mismo para despues redireccinarnos a la pagina correspondiente
  Array.from(document.getElementsByTagName("li")).forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log(e);
    });
  });
};
