/* Importamos el file system */
import fs from "fs";

const getUserCart = (app) => {
  app.get("/cart/:id", (req, res) => {
    /* Agarramos la id */
    const { id } = req.params;

    /* Leemos el archivo correspondiente al id */
    fs.readFile(
      `./api/user_cart/${id}.json`,
      { encoding: "utf-8" },
      (err, data) => {
        if (err) {
          /* Si hay un error al leer el archivo le devolvemos un mensaje de error */
          console.log(`Error: ${err}`);
          res.status(500).send(`Hubo un error por favor intentelo mas tarde`);
          return;
        }

        /* Retornamos el carrito correspondiente */
        res.status(200).send(JSON.parse(data));
      }
    );
  });
};

export default getUserCart;
