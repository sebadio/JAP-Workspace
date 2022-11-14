/* Importamos el file system */
import fs from "fs";

const handleCartBuy = (app) => {
  app.post("/cart", (req, res) => {
    /* Guardamos los datos de la compra en una variable y le asignamos un IDRandom */
    const order = JSON.stringify(req.body);
    const orderId =
      new Date().getUTCMilliseconds() * Math.round(Math.random() * 1000);

    /* Creamos un json y guardamos los datos */
    fs.writeFile(`./orders/${orderId}.json`, order, (err) => {
      if (err) {
        /* Si hay un error se lo hacemos saber al usuario */
        res.status(501).send("Ocurrio un error");
        return;
      }

      /* Retornamos el mensaje de exito */
      res.status(200).send("Compra realizada con exito");
    });
  });
};

export default handleCartBuy;
