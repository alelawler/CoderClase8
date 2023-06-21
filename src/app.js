import express, { Router } from "express";
import handlebars from "express-handlebars";
import path from "path";
import {mongoose} from "mongoose";
import {viewsRouter} from "./routes/views/views.router.js";
import {productsRouter} from "./routes/v1/products.router.js";
import {productsRouterV2} from "./routes/v2/products.router.js";
import {cartRouter} from "./routes/v1/cart.router.js";
import {cartRouterV2} from "./routes/v2/cart.router.js";
import { __dirname } from "./utils.js";
import {Server} from "socket.io";

const app = express();

app.engine("handlebars",handlebars.engine())
app.set("views",__dirname+"/views");
app.set("view engine","handlebars");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, "public")));
const port = 8080;

const httpServer = app.listen(port, ()=> {
    console.log('Server up in http://localhost:'+port)
});

try{
    mongoose.connect('mongodb+srv://alelawler93:alelawler93@bmstrikecluster.6gsxtak.mongodb.net/?retryWrites=true&w=majority')
}
catch(error){
    console.log("Can't connect to DB: " + error);
    process.exit();
}            

//---------------------v1------------------------
const router = express.Router();
app.use('/api/v1', router);
router.use('/products', productsRouter);
router.use('/cart', cartRouter);

//------------------------v2-----------------------
const routerV2 = express.Router();
app.use('/api/v2', routerV2);
routerV2.use('/products', productsRouterV2);
routerV2.use('/cart', cartRouterV2);

//----------------------views----------------------
const routerViews = express.Router();
app.use("/",viewsRouter);

export const socketServer = new Server(httpServer);

socketServer.on('connection',socket => {
});