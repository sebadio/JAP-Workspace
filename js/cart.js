/* Funcion que llama a todas las demas funciones */

const addTableData = async () => {
  const articles = JSON.parse(localStorage.getItem("cart"));

  if (checkArticles(articles)) {
    return;
  }

  addTable();

  addTableItems(articles);

  handleSumTotal();

  addForm();
};

/* Funcion que chequea si tenemos datos en el carrito y muestra una alerta si no tenemos nada */

const checkArticles = (articles) => {
  if (
    articles === null ||
    articles === undefined ||
    !articles ||
    articles === {} ||
    Object.keys(articles).length === 0 ||
    Object.keys(articles).length < 1
  ) {
    document.getElementById("contenedor").innerHTML = `
            <div class="p-4 bg-dark rounded text-white text-center">
                No tienes nada en tu carrito <a class="text-white fw-bold" href="categories.html">Empieza a comprar ahora!</a>
            </div>
            `;
    return true;
  }
  return false;
};

/* Funcion que agrega la tabla a la pagina */

const addTable = () => {
  document.getElementById("contenedor").innerHTML = `
    <table class="table table-striped align-middle">
    <thead>
        <tr class="table-dark text-center">
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col">Costo</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
            <th scope="col">Eliminar</th>
        </tr>
    </thead>
    <tbody id="tableBody"></tbody>
    <foot>
    </tfoot>
        <tr class="table-dark text-center">
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Total:</th>
            <th scope="col" style="font-family: sans-serif;" class="text-wrap" id="sumTotal"></th>
            <th scope="col"></th>
        </tr>
    </table>

    <hr >

    <form id="formulario"></form>
  `;
};

/* Funcion que puebla la tabla con los datos */

const addTableItems = (articles) => {
  if (checkArticles(articles)) {
    return;
  }

  const tableBody = document.getElementById("tableBody");

  tableBody.innerHTML = "";

  for (const key in articles) {
    const { id, imagen, name, costo, count, currency } = articles[key];

    tableBody.innerHTML += `
    <tr class="text-center">
        <td class="w-25"><img class="img-fluid w-50 rounded" src="${imagen}"></td>
        <td class="fw-bold">${name}</td>
        <td class="text-nowrap" style="font-family: sans-serif;">${currency} ${costo}</td>
        <td><input min="1" class="form-control w-50 text-start mx-auto" onchange="updatePrice(${id}, '${currency}', '${costo}')" id="count${id}" type="number" value="${count}" ></td>
        <td id="subtotal${id}" style="font-family: sans-serif;" class="fw-bolder text-nowrap subtotal">${currency} ${
      costo * count
    }</td>
    <td><button onclick="handleRemoveItem(${id})" class="btn btn-outline-dark"><i class="fas fa-times"></i></button></td>
    </tr>
    `;
  }
};

/* Funcion que usamos para remover un item de el carrito */

const handleRemoveItem = (id) => {
  let articles = JSON.parse(localStorage.getItem("cart"));

  delete articles[id];

  localStorage.setItem("cart", JSON.stringify(articles));

  addTableItems(articles);
  if (articles && Object.keys(articles) > 0) {
    handleSumTotal();
  }
};

/* Funcion que actualiza el precio */

const updatePrice = (id, currency, costo) => {
  const cant = document.getElementById("count" + id).value;

  const cart = JSON.parse(localStorage.getItem("cart"));

  cart[id].count = cant;

  localStorage.setItem("cart", JSON.stringify(cart));

  document.getElementById("subtotal" + id).innerHTML = `${currency} ${
    costo * cant
  }`;

  handleSumTotal();
};

/* Funcion que calcula y actualiza el precio total */

const handleSumTotal = () => {
  const subtotales = document.querySelectorAll(".subtotal");

  let sumTotal = 0;

  for (let i = 0; i < subtotales.length; i++) {
    const element = document
      .querySelectorAll(".subtotal")
      [i].innerHTML.split(" ");

    let price = Number(element[1]);

    if (element[0] === "UYU") {
      price = element[1] / 40;
    }

    sumTotal += Number(price);
  }

  document.getElementById("sumTotal").setAttribute("value", sumTotal);
  document.getElementById("sumTotal").innerHTML = `USD ${Math.round(sumTotal)}`;
};

/* Funcion que agrega el formulario a la pagina */

const addForm = () => {
  document.getElementById("formulario").innerHTML = `
          <h4>Tipo de envio</h4>
  
          <div class="form-check">
              <input type="radio" class="form-check-input" id="premiumShipping" name="optradio" value="premium" checked>
              <label class="form-check-label" for="premiumShipping">Premium 2 a 5 días (15%)</label>
          </div>
          <div class="form-check">
              <input type="radio" class="form-check-input" id="expresShiping" name="optradio" value="express">
              <label class="form-check-label" for="expresShiping">Express 5 a 8 días (7%)</label>
          </div>
          <div class="form-check">
              <input type="radio" class="form-check-input" id="standardShipping" name="optradio" value="standard">
              <label class="form-check-label" for="standardShipping">Standard 12 a 15 días (5%)</label>
          </div>
  
          <div class="row mt-4">
              <div class="col-6">
                  <label class="form-check-label">Calle</label>
                  <input class="form-control" id="inputCalle" required minlength="3" type="text">
                  <label class="form-check-label mt-2">Esquina</label>
                  <input class="form-control" id="inputEsquina" required minlength="3" type="text">
                  </div>
              <div class="col-4">    
                  <label class="form-check-label">Número</label>
                  <input class="form-control" id="inputNumber" required min="1" type="number">
              </div>
          </div>
  
          <button class="btn btn-outline-dark fw-bold mt-4" type="submit">Comprar</button>
      `;

  document.getElementById("formulario").addEventListener("submit", (e) => {
    handleSubmit(e);
  });
};

/* Funcion que se encarga de manejar los datos del formulario al ser enviado */

const handleSubmit = (e) => {
  e.preventDefault();

  const premiumShipping = document.getElementById("premiumShipping").checked;
  const expresShiping = document.getElementById("expresShiping").checked;
  const standardShipping = document.getElementById("standardShipping").checked;

  const cart = JSON.parse(localStorage.getItem("cart"));

  const calle = document.getElementById("inputCalle").value;
  const numero = Number(document.getElementById("inputNumber").value);
  const esquina = document.getElementById("inputEsquina").value;
  const cost = document.getElementById("sumTotal").getAttribute("value");
  const currency = document.getElementById("sumTotal").innerHTML.split(" ")[0];
  let shippingType;

  if (premiumShipping) {
    shippingType = "premium";
  }

  if (expresShiping) {
    shippingType = "express";
  }

  if (standardShipping) {
    shippingType = "standard";
  }

  const orderData = {
    calle,
    numero,
    esquina,
    currency,
    cost,
    shippingType,
    roundedCost: Math.ceil(cost),
    cart,
  };

  console.log(orderData);
};

/* Escuchamos a cuando el DOM se cargue para llamar a la funcion principal */

document.addEventListener("DOMContentLoaded", () => {
  addTableData();
});
