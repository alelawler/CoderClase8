import fs from 'fs';

class ProductManagerClase4{
  #path;
  //private cuz there is the method getProducts and getProductByID.
  #products =[];

  constructor(_path){
    this.#path = _path
  }

  //#region clase 4 - hace y Loguea en consola
  async addProductClase4(title, description, price, thumbnail, code, stock){

    if(fs.existsSync(this.#path)){
      let productsJSON = await fs.promises.readFile(this.#path,"utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }

    //All required or number
    if(title && description && thumbnail && code){
      if(this.#products.find(x=>x.code == code)){
        console.log("There is already a product with that code");
        return;        
      }
      if(isNaN(stock)){
        console.log("Stock is not a number");
        return;
      }
      if(isNaN(price)){
        console.log("Please, enter a valid price");
        return;
      }
    
      const product = new Product();
      product.title = title;
      product.description = description;
      product.price = price;
      product.thumbnail = thumbnail;
      product.code = code;
      product.stock = stock;

      let maxID = 0;

      if(this.#products.length > 0){
        this.#products.forEach(element => {
          if(element.id > maxID){
            maxID = element.id
          }
        });
      }
      product.id= maxID+1;
      this.#products.push(product);

      let productString = JSON.stringify(this.#products);
      await fs.promises.writeFile(this.#path,productString);

    }
    else{
        console.log("A product is missing information");
    }
  }
  async getProductsClase4() {
    if(fs.existsSync(this.#path)){
      let productsJSON = await fs.promises.readFile(this.#path,"utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }
  
    console.log(this.#products);
  }
  async getProductByIDClase4(id){
    if(fs.existsSync(this.#path)){
      let productsJSON = await fs.promises.readFile(this.#path,"utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }
    let result = this.#products.find(x => x.id == id)??"Not found";
    console.log(result);
  }
  async updateProductClase4(id,propertyName,newValue){
    if(propertyName == null || newValue == null){
      console.log("Please write a property and a value");
      return;
    }
    if(fs.existsSync(this.#path)){
      let productsJSON = await fs.promises.readFile(this.#path,"utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }
    let product = this.#products.find(x => x.id == id);

    if(product != undefined ){
      product[propertyName] = newValue;
      console.log("Product updated. Updated list:");
      console.log(this.#products);
      let productString = JSON.stringify(this.#products);
      await fs.promises.writeFile(this.#path,productString);
    }
    else{
      console.log("Product does not exists.")
    }
  }
  async deleteProductClase4(id){

    if(fs.existsSync(this.#path)){
      let productsJSON = await fs.promises.readFile(this.#path,"utf-8");
      let productsArray = JSON.parse(productsJSON);
      this.#products = productsArray;
    }
    const productIndex = this.#products.findIndex((x) => x.id === id);
    if (productIndex > -1) {
      this.#products.splice(productIndex, 1);
      console.log("Product deleted. Updated list:");
      console.log(this.#products);
      let productString = JSON.stringify(this.#products);
      await fs.promises.writeFile(this.#path,productString);
    }
    else
    console.log("The product does not exist.")
  }
//#endregion
}

class Product{
  id;
  status;
  title;
  description;
  price;
  thumbnail;
  code;
  stock;
}


async function test (){
//Testing
//0 - delete file
//fs.unlink(".\\DBProductManager.txt");

//1 Instanciar ProductManager
const PM = new ProductManagerClase4(".\\DBProductManager.txt");
//getProducts devuelve un vacio y lo imprimo en consola
  //await PM.getProducts();

  //Agrego producto
  await PM.addProductClase4("producto prueba 1","Este es un producto prueba 111",200,"Sin imagen","abc123",25);

  //llamo a getproducts
  await PM.getProductsClase4();
  
  //Busco producto
  await PM.getProductByIDClase4(1);
  
  //updateo new code
  await PM.updateProductClase4(1,"code","newCode");
  
  //Busco producto
  await PM.getProductByIDClase4(1);
  
  //Borro producto
  await PM.deleteProductClase4(1); 
}
