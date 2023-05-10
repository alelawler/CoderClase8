import {Router} from "express";
import {CartManager} from "./../../CartManager.js";

export const cartRouter = Router();

const CM = new CartManager("src/DBCartManager.txt");

cartRouter.post('/', async (req,res) =>{
 let msg =  await CM.createCart();
 res.json(msg);
});

cartRouter.get("/:cid",async (req,res) =>{
        const id = req.params.cid;
        let cart = await CM.getCart(id);
        res.json(cart);
   });

   cartRouter.post("/:cid/product/:pid",async (req,res) =>{
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const quantity = 1; 

        let cart = await CM.addToCart(idCart, idProduct, quantity);
        res.json(cart);
   });