import { ProductManagerMongo } from "./ProductManagerMongo.js";
import { isValidObjectId, Types } from "mongoose";

const PM = new ProductManagerMongo();

import { cartModel } from "./models/cart.model.js";
import res from "express/lib/response.js";

export class CartManagerMongo {
  async getCart(id) {
    try {
      let result = await cartModel.findById(id);
      return result;
    } catch (error) {
      return "error: " + error;
    }
  }

  async addToCart(idCart, idProduct, prodQuantity) {
    prodQuantity = parseInt(prodQuantity);

    if (await PM.existProduct(idProduct)) {
      if (isNaN(prodQuantity)) {
        return "Insert valid numbers";
      }

      if (!isValidObjectId(idCart) || !isValidObjectId(idProduct)) {
        return "Insert valid IDs";
      }

      let cart = await this.getCart(idCart);
      if (cart != null) {
        let productExist = false;
        if (cart.products.length > 0) {
          for (const product in cart.products) {
            if (cart.products[product].product.toString() === idProduct) {
              productExist = true;
            }
          }
        }

        if (!productExist) {
        cart.products.push({product:idProduct,quantity:prodQuantity})
        let result = await cartModel.updateOne({_id:idCart},cart)
        return result;
        }

      } else {
        return "Cart not found";
      }
    } else {
      return "Product not found";
    }
  }
  async createCart() {
    const cartResponse = new cartReturn();
    try {
      let result = await cartModel.create({ products: [] });
      cartResponse.id = result._id;
      cartResponse.products = result.products;
      return cartResponse;
    } catch (error) {
      return "error: " + error;
    }
  }
}

class cartReturn {
  id;
  products = [];
}
