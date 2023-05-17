import {Router} from "express";
import { ProductManager } from "./../../ProductManager.js";

export const viewsRouter = Router();

const PM = new ProductManager("src/DBProductManager.txt");

viewsRouter.get("/",async (req,res)=>{
    let allProducts = await PM.getProducts();
    res.render("home",{
        allProducts
    });
});

viewsRouter.get("/realtimeproducts",async (req,res)=>{
    let allProducts = await PM.getProducts();
    res.render("realTimeProducts",{
        allProducts
    });
});