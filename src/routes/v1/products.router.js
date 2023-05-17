import { Router } from "express";
import { ProductManager } from "./../../ProductManager.js";

export const productsRouter = Router();

const PM = new ProductManager("src/DBProductManager.txt");

productsRouter.get('/', async (req, res) => {
    const limit = req.query.limit;
    let productsTemp = await PM.getProducts();
    let products = productsTemp;

    if (limit != null) {
        if (!isNaN(limit)) {
            products = productsTemp.slice(0, limit);
        }
    }

    res.json(products);
});

productsRouter.get('/:pid', async (req, res) => {
    let id = req.params.pid;
    let product = await PM.getProductByID(id);
    res.json(product);
});

productsRouter.delete("/:pid", async (req, res) => {
    let id = req.params.pid;
    let msg = await PM.deleteProduct(id);
    res.json(msg);
});

productsRouter.post("/", async (req, res) => {
    const newProduct = req.body;

    let msg = await PM.addProduct(newProduct);

    res.json(msg);
});

productsRouter.put("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    const productUpdate = req.body;

    let msg = await PM.updateProduct(id, productUpdate);

    res.json(msg);

});