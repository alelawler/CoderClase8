import {Router} from "express";
import {ProductManagerMongo} from "./../../ProductManagerMongo.js";

export const productsRouterV2 = Router();

const PM = new ProductManagerMongo();

productsRouterV2.get('/', async (req,res) =>{
    const limit = req.query.limit??10;
    const page = req.query.page??"1";
    const {query} = req.query.query??null;
    const sort = req.query.sort??null;

const url = (req.protocol + '://' + req.get('host')+ req.originalUrl)

    let response = await PM.getProducts(limit,page,query,sort,url); 

    res.send(response);
});

productsRouterV2.get('/:pid', async (req, res) => {
    let id = req.params.pid;
    let product = await PM.getProductByID(id);
    res.send(product);
});

productsRouterV2.delete("/:pid", async (req, res) => {
    let id = req.params.pid;
    let msg = await PM.deleteProduct(id);
    res.send(msg);
});

productsRouterV2.put("/:id", async (req, res) => {
    let id = req.params.id;
    const productUpdate = req.body;

    let msg = await PM.updateProduct(id, productUpdate);

    res.send(msg);

});

productsRouterV2.post("/", async (req, res) => {
    const newProduct = req.body;
    let msg = await PM.addProduct(newProduct);
    res.send(msg);
});
