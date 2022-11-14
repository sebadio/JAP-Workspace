/* Importamos el file system */
import fs from "fs";

/* Nos devuelve el json entero con todas las categorias */
export const getAllCategories = (app) => {
  app.get("/cat/", (req, res) => {
    /* Lee el archivo de las categorias */
    fs.readFile(`./api/cats/cat.json`, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        /* Si hubo un error en el proceso se lo hace saber al usuario */
        console.log(`Error: ${err}`);
        res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
        return;
      }

      const categories = JSON.parse(data);
      res.status(200).send(categories);
    });
  });
};

export const getSingleCategory = (app) => {
  app.get("/cat/:id", (req, res) => {
    /* Agarramos el id */
    const { id } = req.params;

    /* Leemos el archivo con el id correspondiente */
    fs.readFile(`./api/cats/cat.json`, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        /* Si hubo un error en el proceso se lo hace saber al usuario */
        console.log(`Error: ${err}`);
        res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
        return;
      }

      /* Agarramos las categorias */
      const categories = JSON.parse(data);

      /* Iteramos las categorias y si el id coincide con el solicitado se la devolvemos */
      for (let i = 0; i < categories.length; i++) {
        const element = categories[i];
        if (parseInt(element.id) === parseInt(id)) {
          res.status(200).send(element);
          return;
        }
      }

      /* Si no se encuentra la categoria con ese numero le devolvemos un mensaje de error */
      res.status(404).send(`No existe la categoria con el id: ${id}`);
    });
  });
};

/* Funcion que nos devuelve los productos de una categoria */
export const getCategoryProducts = (app) => {
  app.get("/catsProducts/:id", (req, res) => {
    /* Agarramos el id solicitado */
    const { id } = req.params;

    /* Leemos el archivo con el id correspondiente */
    fs.readFile(
      `./api/cats_products/${id}.json`,
      { encoding: "utf-8" },
      (err, data) => {
        if (err) {
          /* Si hay un error se lo hacemos saber al usuario */
          console.log(`Error: ${err}`);
          res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
          return;
        }

        /* Si todo sale bien le devolvemos la lista de productos */
        res.status(200).send(JSON.parse(data));
      }
    );
  });
};
