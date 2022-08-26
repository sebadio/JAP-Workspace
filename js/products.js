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

  const { datos, products } = await fetchProducts();

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
    let array = sorting(products, "name", false);
    poblarLista(array);
  });

  document.getElementById("sortDesc").addEventListener("click", () => {
    let array = sorting(products, "name", true);
    poblarLista(array);
  });

  document.getElementById("sortByCount").addEventListener("click", () => {
    let array = sorting(products, "soldCount", descCount);
    descCount = !descCount;
    poblarLista(array);
  });

  document.getElementById("rangeFilterCount").addEventListener("click", () => {
    let min = document.getElementById("rangeFilterCountMin");
    let max = document.getElementById("rangeFilterCountMax");

    if (min && min !== "" && max && max !== "") {
      let array = products.filter(
        (item) => item.soldCount > min.value && item.soldCount < max.value
      );
      poblarLista(array);

      min.value = "";
      max.value = "";
    }
  });

  document.getElementById("clearRangeFilter").addEventListener("click", () => {
    poblarLista(initialArray);
  });
};
