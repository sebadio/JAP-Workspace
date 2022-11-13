import fs from "fs";
import express from "express";

const puerto = 3030;

const app = express();

/* Categorias */

/* Nos devuelve el json entero con todas las categorias */
app.get("/cat/", (req, res) => {
  fs.readFile(`./api/cats/cat.json`, { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.log(`Error: ${err}`);
      res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
      return;
    }

    const categories = JSON.parse(data);
    res.status(200).send(categories);
  });
});

/* Nos devuelve solo el json que le solicitemos */
app.get("/cat/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile(`./api/cats/cat.json`, { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.log(`Error: ${err}`);
      res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
      return;
    }

    const categories = JSON.parse(data);

    for (let i = 0; i < categories.length; i++) {
      const element = categories[i];
      if (parseInt(element.id) === parseInt(id)) {
        res.status(200).send(element);
        return;
      }
    }

    res.status(500).send(`No existe la categoria con el id: ${id}`);
  });
});

/* cats_products */
app.get("/catsProducts/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile(
    `./api/cats_products/${id}.json`,
    { encoding: "utf-8" },
    (err, data) => {
      if (err) {
        console.log(`Error: ${err}`);
        res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
        return;
      }

      res.status(200).send(JSON.parse(data));
    }
  );
});

/* Products */
app.get("/products/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile(
    `./api/products/${id}.json`,
    { encoding: "utf-8" },
    (err, data) => {
      if (err) {
        console.log(`Error: ${err}`);
        res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
        return;
      }

      res.status(200).send(JSON.parse(data));
    }
  );
});

/* Product Comments */
app.get("/productsComments/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile(
    `./api/products_comments/${id}.json`,
    { encoding: "utf-8" },
    (err, data) => {
      if (err) {
        console.log(`Error: ${err}`);
        res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
        return;
      }

      res.status(200).send(JSON.parse(data));
    }
  );
});

/* Cart */
app.get("/cart/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile(
    `./api/user_cart/${id}.json`,
    { encoding: "utf-8" },
    (err, data) => {
      if (err) {
        console.log(`Error: ${err}`);
        res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
        return;
      }

      res.status(200).send(JSON.parse(data));
    }
  );
});

/* Compra carrito */

app.post("/cart", (req, res) => {
  console.log(req.body);
  res.send(200);
});

app.listen(puerto || 3000, () => {
  console.log(`Server iniciado en el puerto ${puerto}`);
});
