import express, { Router } from "express";
import {productsRouter} from "./routes/v1/products.router.js";
import {productsRouterV2} from "./routes/v2/products.router.js";
import {cartRouter} from "./routes/v1/cart.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const port = 8080;

//Practicando con versionado. La version 1 es la de la clase 8
//No se muy bien cual es la convencion de routeado y versionado
//Si tenes algun comentario estaria genial. Gracias ♥
//---------------------v1------------------------
const router = express.Router();
app.use('/api/v1', router);
router.use('/products', productsRouter);
router.use('/cart', cartRouter);

//------------------------v2-----------------------
const routerV2 = express.Router();
app.use('/api/v2', routerV2);
routerV2.use('/products', productsRouterV2);


app.listen(port, ()=> {
    console.log('Server up in http://localhost:'+port)
});