window.onload = async () => {
  const container = document.getElementById("container");

  const url = `https://japceibal.github.io/emercado-api/cats_products/101.json`;

  const respuesta = await fetch(url);
  const datos = await respuesta.json();

  console.log(datos);

  const { products } = datos;

  container.innerHTML = `
    <h2 class="fw-bold mt-4">Productos</h2>
    <br>
    <p>Aqui veras todos los productos de la categoria: ${datos.catName}</p>
    <ul id="lista" class="list-group w-100"></ul>
    `;

  const lista = document.getElementById("lista");

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

  Array.from(document.getElementsByTagName("li")).forEach((element) => {
    element.addEventListener("click", (e) => {
      console.log(e);
    });
  });
};
