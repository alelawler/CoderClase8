import {Router} from "express";
import {CartManagerMongo} from "./../../CartManagerMongo.js";

export const cartRouterV2 = Router();

const CM = new CartManagerMongo();

cartRouterV2.post('/', async (req,res) =>{
 let response =  await CM.createCart();
 res.send(response);
});
cartRouterV2.get("/:cid",async (req,res) =>{
        const id = req.params.cid;
        let cart = await CM.getCart(id);
        res.send(cart);
   });

   cartRouterV2.post("/:cid/products/:pid",async (req,res) =>{
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const quantity = req.body.quantity; 

        let cart = await CM.addToCart(idCart, idProduct, quantity);
        res.send(cart);
   });