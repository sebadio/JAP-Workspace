/* Importamos el file system */
import fs from "fs";

/* Funcion que nos devuelve los productos solicitados */
export const getProducts = (app) => {
  app.get("/products/:id", (req, res) => {
    /* Agarramos el id solicitado */
    const { id } = req.params;

    /* Leemos el archivo correspondiente al id */
    fs.readFile(
      `./api/products/${id}.json`,
      { encoding: "utf-8" },
      (err, data) => {
        if (err) {
          /* Si hay un error se lo hacemos saber al usuario */
          console.log(`Error: ${err}`);
          res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
          return;
        }

        /* Si todo sale bien le enviamos al usuario el producto */
        res.status(200).send(JSON.parse(data));
      }
    );
  });
};

/* Funcion que nos devuelve los comentarios del producto seleccionado */
export const getProductComments = (app) => {
  app.get("/productsComments/:id", (req, res) => {
    /* Agarramos la id */
    const { id } = req.params;

    /* Leemos el archivo correspondiente al id recibido */
    fs.readFile(
      `./api/products_comments/${id}.json`,
      { encoding: "utf-8" },
      (err, data) => {
        if (err) {
          /* Si hay un error al leer el archivo le devolvemos un mensaje de error */
          console.log(`Error: ${err}`);
          res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
          return;
        }
        /* Si todo salio bien le enviamos los comentarios */
        res.status(200).send(JSON.parse(data));
      }
    );
  });
};
