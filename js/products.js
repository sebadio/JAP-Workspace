const fetchProducts = async () => {
  // Hacemos el fetch de los productos y extraemos los productos
  const url = `https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem(
    "catID"
  )}.json`;

  const respuesta = await fetch(url);
  const datos = await respuesta.json();

  const { products } = datos;

  return { datos, products };
};

const poblarLista = (products) => {
  // Agarramos la lista
  const lista = document.getElementById("lista");

  // Limpiamos la lista por si tiene datos antiguos
  lista.innerHTML = "";

  // Poblamos la lista con los productos y sus respectivas clases de Bootstrap
  products.map((producto) => {
    lista.innerHTML += `
      <li class="list-group-item w-100 d-flex flex-row p-2 justify-content-between list-group-item-action cursor-active">
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
};

let descCount = false;

const sorting = (array, tipo, desc) => {
  array.sort((a, b) => {
    if (a[tipo] < b[tipo]) return -1;
    if (a[tipo] > b[tipo]) return 1;
    return 0;
  });

  if (desc) array.reverse();

  return array;
};

// Esperamos a que se carguen los elementos del DOM:

window.onload = async () => {
  setUser();

  // Agarramos el div en el que se van a encontrar los productos:
  const container = document.getElementById("container");
  const titulo = document.getElementById("title");

  let { datos, products } = await fetchProducts();

  let initialArray = [...products];

  // Modificamos el titulo para que muestre lo que queremos:

  titulo.innerHTML = `
    <h2>Productos</h2>
    <p>Aqui veras todos los productos de la categoria ${datos.catName}</p>
  `;

  // Modificamos el contenido del div para preparalo para los datos que vamos a recibir
  container.innerHTML = `<ul id="lista" class="list-group w-100"></ul>`;

  poblarLista(products);

  document.getElementById("sortAsc").addEventListener("click", () => {
    products = sorting(products, "name", false);
    poblarLista(products);
  });

  document.getElementById("sortDesc").addEventListener("click", () => {
    products = sorting(products, "name", true);
    poblarLista(products);
  });

  document.getElementById("sortByCount").addEventListener("click", () => {
    document.getElementById("sortValue").innerHTML = `
      <i class="fas fa-sort-amount-${descCount ? "down" : "up"} mr-1"></i> $
    `;
    products = sorting(products, "cost", descCount);
    descCount = !descCount;
    poblarLista(products);
  });

  document.getElementById("sortByRel").addEventListener("click", () => {
    document.getElementById("sortRel").innerHTML = `
      <i class="fas fa-sort-amount-${descCount ? "down" : "up"} mr-1"></i> Rel
    `;
    products = sorting(products, "soldCount", descCount);
    descCount = !descCount;
    poblarLista(products);
  });

  document.getElementById("rangeFilterCount").addEventListener("click", () => {
    let min =
      document.getElementById("rangeFilterCountMin").value !== ""
        ? Number(document.getElementById("rangeFilterCountMin").value)
        : 0;
    let max =
      document.getElementById("rangeFilterCountMax").value !== ""
        ? Number(document.getElementById("rangeFilterCountMax").value)
        : 999999999;

    products = products.filter((item) => item.cost >= min && item.cost <= max);
    poblarLista(products);
  });

  document.getElementById("clearRangeFilter").addEventListener("click", () => {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    products = initialArray;
    poblarLista(initialArray);
  });

  document.getElementById("searchInput").addEventListener("input", () => {
    let input = document.getElementById("searchInput").value;

    if (input === "" || input === undefined || input === null) {
      poblarLista(products);
    } else {
      let searchArray = products.filter((item) =>
        item.name.toLowerCase().includes(input.toLowerCase())
      );
      poblarLista(searchArray);
    }
  });
};
