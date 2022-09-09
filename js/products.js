// Funcion que hace el fetch de los productos
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

const redirectProduct = (e) => {
  localStorage.setItem("productId", e);
  location.href = "product-info.html";
};

// Funcion que pobla la lista en base a un array
const poblarLista = (products) => {
  console.log(products);

  // Agarramos la lista
  const lista = document.getElementById("lista");

  // Limpiamos la lista por si tiene datos antiguos
  lista.innerHTML = "";

  // Poblamos la lista con los productos y sus respectivas clases de Bootstrap
  products.map((producto) => {
    lista.innerHTML += `
      <li class="list-group-item w-100 d-flex flex-row p-2 justify-content-between list-group-item-action cursor-active" onclick="redirectProduct(${producto.id})">
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

// Inicializamos la variable desc para modificarla si es necesario
let descCount = false;
let descPrice = false;

/* Funcion que ordena un array en base al tipo que se le de y lo envia al reves 
 si tiene que ser descendiente */
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
  // Agarramos el div en el que se van a encontrar los productos:
  const container = document.getElementById("container");
  const titulo = document.getElementById("title");

  let { datos, products } = await fetchProducts();

  let initialArray = [...products];

  // Modificamos el titulo para que muestre el nombre de la categoria que estamos viendo:
  titulo.innerHTML = `
    <h2>Productos</h2>
    <p>Aqui veras todos los productos de la categoria ${datos.catName}</p>
  `;

  // Modificamos el contenido del div para preparalo para los datos que vamos a mapear
  container.innerHTML = `<ul id="lista" class="list-group w-100"></ul>`;

  poblarLista(products);

  // Filtro de nombre Asc
  document.getElementById("sortAsc").addEventListener("click", () => {
    // Ordenamos el array en base a su nombre (asc)
    products = sorting(products, "name", false);
    poblarLista(products);
  });

  // Filtro de nombre Desc
  document.getElementById("sortDesc").addEventListener("click", () => {
    // Ordenamos el array en base a su nombre (desc)
    products = sorting(products, "name", true);
    poblarLista(products);
  });

  // Filtro de precio
  document.getElementById("sortByCount").addEventListener("click", () => {
    // Cambiamos el icono para reflejar el cambio
    document.getElementById("sortValue").innerHTML = `
      <i class="fas fa-sort-amount-down${!descPrice ? "-alt" : ""} mr-1"></i> $
    `;
    // Ordenamos el array en base a la cantidad vendida (asc)
    products = sorting(products, "cost", descPrice);
    descPrice = !descPrice;
    poblarLista(products);
  });

  // Filtro de relevancia
  document.getElementById("sortByRel").addEventListener("click", () => {
    // Cambiamos el icono para reflejar el cambio
    document.getElementById("sortRel").innerHTML = `
      <i class="fas fa-sort-amount-down${
        !descCount ? "-alt" : ""
      } mr-1"></i> Rel
    `;
    // Ordenamos el array en base a la cantidad vendida (desc)
    products = sorting(products, "soldCount", descCount);
    descCount = !descCount;
    poblarLista(products);
  });

  // Filtro de minimo y maximo
  document.getElementById("rangeFilterCount").addEventListener("click", () => {
    /* Recogemos el valor de min y max, si este esta vacio recurre al valor por defecto
    (en este caso es "0" para el minimo y "999999999" para el maximo) */

    let min =
      document.getElementById("rangeFilterCountMin").value !== ""
        ? Number(document.getElementById("rangeFilterCountMin").value)
        : 0;
    let max =
      document.getElementById("rangeFilterCountMax").value !== ""
        ? Number(document.getElementById("rangeFilterCountMax").value)
        : 999999999;

    // Filtramos en base al costo minimo y maximo
    products = products.filter((item) => item.cost >= min && item.cost <= max);
    poblarLista(products);
  });

  // Limpiar filtros
  document.getElementById("clearRangeFilter").addEventListener("click", () => {
    // Vaciamos el valor de los inputs min y max, devolvemos el array de productos
    //a su forma original y devolvemos la lista al valor inicial tambien
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    products = initialArray;
    poblarLista(initialArray);
  });

  // Filtro de busqueda
  document.getElementById("searchInput").addEventListener("input", () => {
    // Agarramos el valor del input
    let input = document.getElementById("searchInput").value;

    // Si el valor esta vacio volvemos a la lista inicial
    if (input === "" || input === undefined || input === null) {
      poblarLista(products);
    } else {
      // Filtramos la lista en base al input
      let searchArray = products.filter((item) =>
        item.name.toLowerCase().includes(input.toLowerCase())
      );
      poblarLista(searchArray);
    }
  });
};
