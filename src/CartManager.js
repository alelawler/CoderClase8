import fs from 'fs';
import { ProductManager } from './ProductManager.js';
const PM = new ProductManager("src/DBProductManager.txt");

export class CartManager {
  #path;
  #carts = []

  constructor(_path) {
    this.#path = _path
  }

  async getCart(id) {

    if (isNaN(id)) {
      return "ID must be a number";
    }

    if (fs.existsSync(this.#path)) {
      let cartsJSON = await fs.promises.readFile(this.#path, "utf-8");
      let cartsArray = JSON.parse(cartsJSON);
      this.#carts = cartsArray;
    }

    let result = this.#carts.find(x => x.idCarrito == id) ?? "Not found";
    return result;
  }

  async addToCart(idCarrito, idProduct, quantity) {
    idCarrito = parseInt(idCarrito);
    idProduct = parseInt(idProduct);
    quantity = parseInt(quantity);

    if (await PM.existProduct(idProduct)) {

      if (isNaN(idCarrito) || isNaN(idProduct) || isNaN(quantity)) {
        return "Insert valid numbers"
      }

      if (fs.existsSync(this.#path)) {
        let cartsJSON = await fs.promises.readFile(this.#path, "utf-8");
        let cartsArray = JSON.parse(cartsJSON);
        this.#carts = cartsArray;
      }

      let cartIndex = this.#carts.findIndex(x => x.idCarrito === idCarrito);
      let cart = this.#carts[cartIndex];

      if (cartIndex > -1) {
        let productExist = false;
        if(cart.productos.length > 0){

          for (const product in cart.productos) {
            if (cart.productos[product].idProduct === idProduct) {
              productExist = true;
              cart.productos[product].quantity += quantity
            }
          }
        }

        if(!productExist){
          cart.productos.push({"idProduct":idProduct,"quantity":quantity});
        }
          
        let cartsString = JSON.stringify(this.#carts);
        await fs.promises.writeFile(this.#path, cartsString);
        return "product: "+idProduct+" added to kart "+idCarrito;
      }
      else {
        return "Cart not found";
      }
    }
    else {
      return "Product not found";
    }
  }

  async createCart() {

    if (fs.existsSync(this.#path)) {
      let cartsJSON = await fs.promises.readFile(this.#path, "utf-8");
      let cartsArray = JSON.parse(cartsJSON);
      this.#carts = cartsArray;
    }

    let maxID = 0;

    if (this.#carts.length > 0) {
      this.#carts.forEach(element => {
        if (element.idCarrito > maxID) {
          maxID = element.idCarrito
        }
      });
    }

    const cart = new Cart();
    cart.idCarrito = maxID + 1;
    this.#carts.push(cart);
    let cartsString = JSON.stringify(this.#carts);
    await fs.promises.writeFile(this.#path, cartsString);
    return "Cart created with id: " + cart.idCarrito;
  }
}

class Cart {
  idCarrito;
  productos = []
}
