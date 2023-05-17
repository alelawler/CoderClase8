import fs from 'fs';
import { socketServer } from "./app.js";

export class ProductManager {
  #path;
  //private cuz there is the method getProducts and getProductByID.
  #products = [];

  constructor(_path) {
    this.#path = _path
  }

  async getProducts() {

    if (fs.existsSync(this.#path)) {
      let productsJSON = await fs.promises.readFile(this.#path, "utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }
    return this.#products;
  }
  async getProductByID(id) {

    if (isNaN(id)) {
      return "ID must be a number";
    }

    if (fs.existsSync(this.#path)) {
      let productsJSON = await fs.promises.readFile(this.#path, "utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }
    let result = this.#products.find(x => x.id == id) ?? "Not found";
    return result;
  }
  async addProduct(newProduct) {
    //default value = true
    let status = true;

    const title = newProduct.title;
    const description = newProduct.description;
    const code = newProduct.code;
    const category = newProduct.category;
    const stock = newProduct.stock;
    const price = newProduct.price;
    const thumbnail = newProduct.thumbnail;
    status = newProduct.status;

    if (fs.existsSync(this.#path)) {
      let productsJSON = await fs.promises.readFile(this.#path, "utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }

    //All required or number
    if (title && description && category && code) {
      if (this.#products.find(x => x.code == code)) {
        return "There is already a product with that code";
      }
      if (isNaN(stock)) {
        return "Stock is not a number";

      }
      if (isNaN(price)) {
        return "Please, enter a valid price";
      }

      const product = new Product();
      product.title = title;
      product.description = description;
      product.code = code;
      product.price = price;
      product.status = status;
      product.stock = stock;
      product.category = category;
      product.thumbnail = thumbnail;

      let maxID = 0;

      if (this.#products.length > 0) {
        this.#products.forEach(element => {
          if (element.id > maxID) {
            maxID = element.id
          }
        });
      }
      product.id = maxID + 1;
      this.#products.push(product);

      let productString = JSON.stringify(this.#products);
      await fs.promises.writeFile(this.#path, productString);
      this.#updateProductsSocket();
      return "Product added with id: " + product.id;
    }
    else {
      return "Product is missing information";
    }
  }
  async updateProduct(id, productUpdate) {

    if (isNaN(id)) {
      return "ID must be a number";
    }
    if (productUpdate.constructor === Object && Object.keys(productUpdate).length === 0) {
      return "Body cant be empty";
    }

    if (fs.existsSync(this.#path)) {
      let productsJSON = await fs.promises.readFile(this.#path, "utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }

    let product = this.#products.find(x => x.id === id);

    if (product != undefined) {

      for (const propToUpdate in productUpdate) {
        if (!product.hasOwnProperty(propToUpdate)) {
          return "Incorrect Property to update: " + propToUpdate;
        }

        product[propToUpdate] = productUpdate[propToUpdate];
      }
      let productString = JSON.stringify(this.#products);
      await fs.promises.writeFile(this.#path, productString);
      return "Product updated";
    }
    else {
      return "Product does not exists.";
    }
  }
  async deleteProduct(id) {
    id = parseInt(id);

    if (isNaN(id)) {
      return "ID must be a number";
    }
    if (fs.existsSync(this.#path)) {
      let productsJSON = await fs.promises.readFile(this.#path, "utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }

    const productIndex = this.#products.findIndex((x) => x.id === id);

    if (productIndex > -1) {
      this.#products.splice(productIndex, 1);
      let productString = JSON.stringify(this.#products);
      await fs.promises.writeFile(this.#path, productString);
      this.#updateProductsSocket();
      return "Product id N°: " + id + " deleted.";
    }
    else
      return "The product does not exist.";
  }
  async existProduct(id) {
    if (isNaN(id)) {
      return false;
    }

    if (fs.existsSync(this.#path)) {
      let productsJSON = await fs.promises.readFile(this.#path, "utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }

    const productIndex = this.#products.findIndex((x) => x.id === id);

    if (productIndex > -1) {
      return true;
    }
    else {
      return false;
    }
  }
  #updateProductsSocket(){
    socketServer.emit("update",this.#products);
  }
}
class Product {
  id;
  status;
  title;
  description;
  price;
  thumbnail;
  code;
  stock;
}