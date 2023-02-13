/* Funcion que llama a todas las demas funciones */

const addTableData = async () => {
  const articles = JSON.parse(
    localStorage.getItem(localStorage.getItem("user"))
  ).cart;

  if (checkArticles(articles)) {
    return;
  }

  addTableItems(articles);
  addFormData();
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
    document.getElementById("contenedorForm").innerHTML = ``;
    return true;
  }
  return false;
};

/* Funcion que puebla la tabla con los datos */

const addTableItems = (articles) => {
  if (checkArticles(articles)) {
    return;
  }

  const tableBody = document.getElementById("tableBody");

  tableBody.innerHTML = "";
  let tableHTML = "";
  for (const key in articles) {
    const { id, imagen, name, costo, count, currency } = articles[key];

    tableHTML += `
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

  tableBody.innerHTML = tableHTML;
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

const addFormData = () => {
  const user = JSON.parse(localStorage.getItem(localStorage.getItem("user")));

  if (user.adress) {
    document.getElementById("inputCalle").value = user.adress.calle;
    document.getElementById("inputEsquina").value = user.adress.esquina;
    document.getElementById("inputNumber").value = user.adress.numero;
  }

  document.getElementById("metodoDePagoP").innerHTML = `
    ${
      user.metodoPago
        ? `<span class="text-success">Metodo de pago seleccionado: ${user.metodoPago.type}</span>`
        : "Seleccione metodo de pago"
    }
  `;

  document.querySelectorAll("[data-radio]").forEach((element) =>
    element.addEventListener("change", (e) => {
      handleSumTotal(e.target.value);
    })
  );

  document.getElementById("formulario").addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const user = JSON.parse(localStorage.getItem(localStorage.getItem("user")));
    const metodoPago = user.metodoPago;
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

  user.adress = {
    calle,
    numero,
    esquina,
  };

  /* Borramos los items del carrito, porque ya fueron comprados */
  localStorage.setItem(user.email, JSON.stringify({ ...user, cart: {} }));

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
