/* Funcion que llama a todas las demas funciones */

const addTableData = async () => {
  const articles = JSON.parse(
    localStorage.getItem(localStorage.getItem("user"))
  ).cart;

  if (checkArticles(articles)) {
    return;
  }

  addTable();

  addTableItems(articles);

  addForm();

  handleSumTotal();
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
    </table>
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
        <td id="subtotal${id}" style="font-family: sans-serif;" class="fw-bolder text-nowrap" data-subtotal="${currency}">${currency} ${
      costo * count
    }</td>
      <td><button onclick="handleRemoveItem(${id})" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i></button></td>
    </tr>
    `;
  }
};

/* Funcion que usamos para remover un item de el carrito */

const handleRemoveItem = (id) => {
  const user = JSON.parse(localStorage.getItem(localStorage.getItem("user")));
  let articles = user.cart;

  delete articles[id];

  localStorage.setItem(
    localStorage.getItem("user"),
    JSON.stringify({ ...user, cart: articles })
  );

  addTableItems(articles);
  if (articles || Object.keys(articles) > 0) {
    handleSumTotal();
  }
};

/* Funcion que actualiza el precio */

const updatePrice = (id, currency, costo) => {
  const cant = Number(document.getElementById("count" + id).value);

  const user = JSON.parse(localStorage.getItem(localStorage.getItem("user")));
  const cart = user.cart;

  cart[id].count = cant;

  localStorage.setItem(user.email, JSON.stringify({ ...user, cart }));

  document.getElementById("subtotal" + id).innerHTML = `${currency} ${
    costo * cant
  }`;

  handleSumTotal();
};

/* Funcion que calcula y actualiza el precio total */

const handleSumTotal = () => {
  const premiumShipping = document.getElementById("premiumShipping");
  const expresShiping = document.getElementById("expresShiping");
  const standardShipping = document.getElementById("standardShipping");

  let shipping;

  if (premiumShipping.checked) shipping = premiumShipping.value;
  if (expresShiping.checked) shipping = expresShiping.value;
  if (standardShipping.checked) shipping = standardShipping.value;

  const subtotales = document.querySelectorAll("[data-subtotal]");

  let sumTotal = 0;

  for (let i = 0; i < subtotales.length; i++) {
    const element = subtotales[i].innerHTML.split(" ");

    let price = Number(element[1]);

    if (element[0] === "UYU") {
      price = price / 40;
    }

    sumTotal += Number(price);
  }
  const shippingPrice = sumTotal * Number(shipping);

  document.getElementById("sumTotal").innerHTML = `USD ${Math.round(sumTotal)}`;
  document.getElementById("shippingCost").innerHTML = `USD ${Math.round(
    shippingPrice
  )}`;
  document.getElementById(
    "total"
  ).innerHTML = `<strong id="actualTotal">USD ${Math.round(
    sumTotal + shippingPrice
  )}</strong>`;
};

/* Funcion que agrega el formulario a la pagina */

const addForm = () => {
  document.getElementById("formulario").innerHTML = `
          <h4>Tipo de envio</h4>

          <div>
            <div class="form-check">
              <input
                type="radio"
                data-radio="radio"
                class="form-check-input"
                id="premiumShipping"
                name="optradio"
                value="0.15"
                checked
              />
              <label class="form-check-label" for="premiumShipping"
                >Premium 2 a 5 días (15%)</label
              >
            </div>
            <div class="form-check">
              <input
                type="radio"
                data-radio="radio"
                class="form-check-input"
                id="expresShiping"
                name="optradio"
                value="0.07"
              />
              <label class="form-check-label" for="expresShiping"
                >Express 5 a 8 días (7%)</label
              >
            </div>
            <div class="form-check">
              <input
                type="radio"
                data-radio="radio"
                class="form-check-input"
                id="standardShipping"
                name="optradio"
                value="0.05"
              />
              <label class="form-check-label" for="standardShipping"
                >Standard 12 a 15 días (5%)</label
              >
            </div>

            <div class="invalid-feedback">Por favor seleccione una opcion</div>
          </div>

          <div class="row mt-4">
            <h4>Dirección de envío</h4>
            <div class="col-6">
              <div>
                <label class="form-check-label">Calle</label>
                <input
                  class="form-control"
                  id="inputCalle"
                  required
                  minlength="3"
                  type="text"
                />

                <div class="invalid-feedback">Por favor ingrese una calle valida.</div>
              </div>

              <div>
                <label class="form-check-label mt-2">Esquina</label>
                <input
                  class="form-control"
                  id="inputEsquina"
                  required
                  minlength="3"
                  type="text"
                />

                <div class="invalid-feedback">Por favor ingrese una esquina valida.</div>
              </div>
            </div>
            <div class="col-4">
              <div>
                <label class="form-check-label">Número</label>
                <input
                  class="form-control"
                  id="inputNumber"
                  required
                  min="1"
                  type="number"
                />

                <div class="invalid-feedback">Por favor ingrese un numero valido.</div>
              </div>
            </div>
          </div>

          <hr class="my-5" />

          <div class="row">
            <h4>Costos</h4>
            <ul class="list-group">
              <li class="list-group-item">
                <div class="row d-flex justify-content-between">
                  <div class="col-auto">
                    <h5>Subtotal</h5>
                    <p class="m-0">Suma de costos de productos</p>
                  </div>

                  <div class="col-auto d-flex align-items-center">
                    <p
                      class="m-0 text-wrap"
                      style="font-family: sans-serif"
                      id="sumTotal"
                    ></p>
                  </div>
                </div>
              </li>

              <li class="list-group-item">
                <div class="row d-flex justify-content-between">
                  <div class="col-auto">
                    <h5>Costo de envio</h5>
                    <p class="m-0">Según el tipo de envio</p>
                  </div>

                  <div class="col-auto d-flex align-items-center">
                    <p
                      class="m-0 text-wrap"
                      style="font-family: sans-serif"
                      id="shippingCost"
                    ></p>
                  </div>
                </div>
              </li>

              <li class="list-group-item">
                <div class="row d-flex justify-content-between">
                  <div class="col-auto">
                    <h5>Total</h5>
                    <p class="m-0">Total en dolares</p>
                  </div>

                  <div class="col-auto d-flex align-items-center">
                    <p
                      class="m-0 text-wrap"
                      style="font-family: sans-serif"
                      id="total"
                    ></p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <hr class="my-5" />

          <div class="row">
            <h4>Forma de pago</h4>
            <p id="metodoDePagoP">${
              JSON.parse(localStorage.getItem(localStorage.getItem("user")))
                .metodoPago
                ? `<span class="text-success">Metodo de pago seleccionado: ${
                    JSON.parse(
                      localStorage.getItem(localStorage.getItem("user"))
                    ).metodoPago.type
                  }</span>`
                : "Seleccione metodo de pago"
            }</p>
            <a href="#" id="formaPagoAbreModal" class="link-primary" data-bs-toggle="modal" data-bs-target="#pago">
              Seleccionar Metodo de pago
            </a>
          </div>
  
          <div class="row mt-2">
            <div class="col-lg-4"></div>
            <div class="col-lg-4">  
              <button class="btn btn-outline-dark fw-bold mt-4 w-100" type="submit">Comprar</button>
            </div>
            <div class="col-lg-4"></div>
          </div>
      `;

  document.querySelectorAll("[data-radio]").forEach((element) =>
    element.addEventListener("change", (e) => {
      handleSumTotal(e.target.value);
    })
  );

  document.getElementById("formulario").addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const metodoPago = localStorage.getItem("metodoDePago");
    if (
      !document.getElementById("formulario").className.includes("was-validated")
    ) {
      document.getElementById("formulario").classList.add("was-validated");
    }

    if (!metodoPago) {
      document
        .getElementById("formaPagoAbreModal")
        .classList.add("text-danger");
      return;
    }

    if (document.getElementById("formulario").checkValidity() && metodoPago) {
      handleSubmit();
    }
  });
};

/* Funcion que se encarga de manejar los datos del formulario al ser enviado */

const handleSubmit = () => {
  const user = JSON.parse(localStorage.getItem(localStorage.getItem("user")));
  const cart = user.cart;

  const calle = document.getElementById("inputCalle").value;
  const numero = Number(document.getElementById("inputNumber").value);
  const esquina = document.getElementById("inputEsquina").value;
  const cost = Number(
    document.getElementById("actualTotal").innerHTML.split(" ")[1]
  );
  const currency = document
    .getElementById("actualTotal")
    .innerHTML.split(" ")[0];
  const roundedCost = Math.round(cost);
  const shippingType = checkShippingType();

  const orderData = {
    calle,
    numero,
    esquina,
    currency,
    cost,
    shippingType,
    roundedCost,
    cart,
  };

  document.getElementById("container").innerHTML = `
    <div class="row mt-4">
      <div class="col-lg-3"></div>
      <div class="col-lg-6">  
        <h2>Compra realizada con exito</h2>
      </div>
      <div class="col-lg-3"></div>
    </div>

    <div class="row">
      <div class="col-lg-3"></div>
      <div class="col-lg-6">  
        <p>Los articulos seran enviados a: <br /> ${calle} ${numero} esquina ${esquina}</p>
      </div>
      <div class="col-lg-3"></div>
    </div>

    <div class="row">
      <div class="col-lg-3"></div>
      <div class="col-lg-6">  
        <ul class="list-group" id="products"></ul>
      </div>
      <div class="col-lg-3"></div>
    </div>

    
    <div class="row mt-2">
      <div class="col-lg-3"></div>
      <div class="col-lg-6">  
        <p class="text-center">El Total fue de: <strong>${cost} USD</strong></p>
      </div>
      <div class="col-lg-3"></div>
    </div>
  `;

  Object.keys(cart).forEach((element) => {
    const current = cart[element];

    console.log(current);

    document.getElementById("products").innerHTML += `
      <li class="list-group-item d-flex justify-content-between"><span>${
        current.name
      } x ${current.count}</span> <span>${current.costo * current.count} ${
      current.currency
    }</span></li>
    `;
  });
};

/* Escuchamos a cuando el DOM se cargue para llamar a la funcion principal */

document.addEventListener("DOMContentLoaded", () => {
  addTableData();

  const formularioTarjeta = document.getElementById("formularioTarjeta");

  const numTarjeta = document.getElementById("numTarjeta");
  const codigoSeg = document.getElementById("codigoSeg");
  const vencimiento = document.getElementById("vencimientoTarjeta");
  const numCuenta = document.getElementById("numCuenta");

  const formModal = new bootstrap.Modal(document.getElementById("pago"));

  const date = new Date();
  document.getElementById("vencimientoTarjeta").min = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10
      ? "0" + String(date.getMonth() + 1)
      : date.getMonth() + 1
  }`;

  formularioTarjeta.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    formularioTarjeta.classList.add("was-validated");
    if (formularioTarjeta.checkValidity()) {
      if (document.getElementById("tarjetaCheckbox").checked) {
        const numTarjetaValue = numTarjeta.value;
        const codigoSegValue = codigoSeg.value;
        const vencimientoValue = vencimiento.value;

        const tarjeta = {
          numTarjetaValue,
          codigoSegValue,
          vencimientoValue,
          type: "Tarjeta",
        };

        const user = JSON.parse(
          localStorage.getItem(localStorage.getItem("user"))
        );
        localStorage.setItem(
          user.email,
          JSON.stringify({ ...user, metodoPago: tarjeta })
        );
      } else {
        const numCuentaValue = numCuenta.value;

        const user = JSON.parse(
          localStorage.getItem(localStorage.getItem("user"))
        );
        localStorage.setItem(
          user.email,
          JSON.stringify({
            ...user,
            metodoPago: { type: "Cuenta Bancaria", numCuentaValue },
          })
        );
      }

      document.getElementById(
        "metodoDePagoP"
      ).innerHTML = `Metodo de pago seleccionado: ${
        JSON.parse(localStorage.getItem(localStorage.getItem("user")))
          .metodoPago.type
      }`;

      if (
        document
          .getElementById("formaPagoAbreModal")
          .className.includes("text-danger")
      ) {
        document
          .getElementById("formaPagoAbreModal")
          .classList.remove("text-danger");

        document
          .getElementById("formaPagoAbreModal")
          .classList.add("text-success");
      }

      console.log(formModal);
      formModal.hide();
    }
  });

  document.getElementById("tarjetaCheckbox").addEventListener("change", () => {
    numTarjeta.removeAttribute("disabled");
    codigoSeg.removeAttribute("disabled");
    vencimiento.removeAttribute("disabled");

    numCuenta.setAttribute("disabled", "true");
  });

  document.getElementById("cuentaCheckbox").addEventListener("change", () => {
    numCuenta.removeAttribute("disabled");

    numTarjeta.setAttribute("disabled", "true");
    codigoSeg.setAttribute("disabled", "true");
    vencimiento.setAttribute("disabled", "true");
  });
});

const checkShippingType = () => {
  const premiumShipping = document.getElementById("premiumShipping").checked;
  const expresShiping = document.getElementById("expresShiping").checked;
  const standardShipping = document.getElementById("standardShipping").checked;

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

  return shippingType;
};
