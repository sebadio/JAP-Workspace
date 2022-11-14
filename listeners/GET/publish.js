import fs from "fs";
const publish = (app) => {
  app.get("/publish/", (req, res) => {
    fs.readFile(
      `./api/sell/publish.json`,
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

export default publish;
