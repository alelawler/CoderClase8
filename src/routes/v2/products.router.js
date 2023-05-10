import {Router} from "express";
import {ProductManager} from "./../../ProductManager.js";

export const productsRouterV2 = Router();

const PM = new ProductManager("src/DBProductManager.txt");

productsRouterV2.get('/', async (req,res) =>{
res.json("Version 2!")
});

productsRouterV2.get('/:id', async (req,res) =>{
    res.json("Version 2!")
});