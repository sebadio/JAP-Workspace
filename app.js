/* Importamos express y las funciones de escucha */
import express from "express";

/* Importamos las funciones del GET */
import {
  getAllCategories,
  getSingleCategory,
  getCategoryProducts,
} from "./listeners/GET/category.js";
import { getProducts, getProductComments } from "./listeners/GET/products.js";
import getUserCart from "./listeners/GET/cart.js";

/* Importamos las funciones del POST */
import handleCartBuy from "./listeners/POST/handleCartBuy.js";

/* Puerto en el que se va a servir la aplicacion */
const puerto = 3030;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Categorias */
getAllCategories(app); /* Nos devuelve todas las categorias */
getSingleCategory(app); /* Nos devuelve solo la categoria solicitada */

/* cats_products */
getCategoryProducts(app); /*Devuelve los productos de la categoria solicitada*/

/* Products */
getProducts(app); /* Devuelve el producto solicitado */

/* Product Comments */
getProductComments(app); /* Devuelve los comentarios del producto solicitado */

/* Cart */
getUserCart(app); /* Devuelve el carrito del usuario */

/* Compra carrito */
handleCartBuy(app); /* Guarda la compra en orders/*.json */

/* Enciende el servidor en el puerto designado arriba, sino hay uno designado predetermina a 3000 */
app.listen(puerto || 3000, () => {
  console.log(`Server iniciado en el puerto ${puerto}`);
});
