import { productModel } from "./models/product.model.js";

export class ProductManagerMongo {
  async getProducts(limit, page, query, sort, url) {
    const productsResponse = new ProductsReturn();
    try {
      let products;

      if (sort != null) {
        if (sort == "asc") sort = 1;
        else if (sort == "desc") sort = -1;

        products = await productModel
          .find(query)
          .limit(limit)
          .skip((page - 1) * limit)
          .sort({ price: sort });
      } else {
        products = await productModel
          .find(query)
          .limit(limit)
          .skip((page - 1) * limit);
      }

      productsResponse.status = "success";
      productsResponse.payload = products;
      let productsAll = await productModel.find(query);
      const totalPages = Math.ceil(productsAll.length / limit);
      productsResponse.totalPages = totalPages; //: Total de páginas
      productsResponse.prevPage = +page - 1;
      productsResponse.nextPage = +page + 1;
      productsResponse.page = page;
      productsResponse.hasPrevPage = +page == 1 ? false : true;
      productsResponse.hasNextPage = +page < +totalPages ? true : false;
      productsResponse.prevLink =
        productsResponse.hasPrevPage == true
          ? url.replace("page=" + page, "page=" + productsResponse.prevPage)
          : null;
      productsResponse.nextLink =
        productsResponse.hasNextPage == true
          ? url.replace("page=" + page, "page=" + productsResponse.nextPage)
          : null;
    } catch (error) {
      productsResponse.status = "error: " + error;
    }

    return productsResponse;
  }
  async getProductByID(id) {
    const productsResponse = new ProductsReturn();
    try {
      let result = await productModel.findById(id);
      productsResponse.status = "success";
      productsResponse.payload = result;
    } catch (error) {
      productsResponse.status = "error: " + error;
    }

    return productsResponse;
  }
  async addProduct(newProduct) {
    //default value = true
    const productsResponse = new ProductsReturn();
    let status = true;

    const title = newProduct.title;
    const description = newProduct.description;
    const code = newProduct.code;
    const category = newProduct.category;
    const stock = newProduct.stock;
    const price = newProduct.price;
    const thumbnail = newProduct.thumbnail;
    status = newProduct.status;

    //All required or number
    if (title && description && category && code) {
      if ((await productModel.find({ code: code })).length != 0) {
        productsResponse.status =
          "error: There is already a product with that code";
        return productsResponse;
      }
      if (isNaN(stock)) {
        productsResponse.status = "error: Stock is not a number";
        return productsResponse;
      }
      if (isNaN(price)) {
        productsResponse.status = "error: Please, enter a valid price";
        return productsResponse;
      }
      try {
        let result = await productModel.create({
          title: title,
          description: description,
          code: code,
          category: category,
          stock: stock,
          price: price,
          thumbnail: thumbnail,
          status: status,
        });
        productsResponse.status = "success";
        productsResponse.payload = result;
      } catch (error) {
        productsResponse.status = "error: " + error;
      }
      return productsResponse;
    } else {
      productsResponse.status = "error: Product is missing information";
      return productsResponse;
    }
  }
  async updateProduct(id, productUpdate) {
    const productsResponse = new ProductsReturn();

    if (
      productUpdate.constructor === Object &&
      Object.keys(productUpdate).length === 0
    ) {
      productsResponse.status = "error: Body cant be empty";
      return productsResponse;
    }

    let product = (await this.getProductByID(id)).payload;
    if (product != undefined) {
      for (const propToUpdate in productUpdate) {
        if (product[propToUpdate] == undefined) {
          productsResponse.status =
            "error: Incorrect Property to update: " + propToUpdate;
          return productsResponse;
        }

        product[propToUpdate] = productUpdate[propToUpdate];
      }
      try {
        let result = await productModel.updateOne({ _id: id }, product);
        productsResponse.status = "Success";
        productsResponse.payload = product;
      } catch (error) {
        productsResponse.status = "error: " + error;
      }

      return productsResponse;
    } else {
      productsResponse.status = "error: Product does not exists";
      return productsResponse;
    }
  }
  async deleteProduct(id) {
    let result;
    try {
      result = await productModel.deleteOne({ _id: id });
    } catch (error) {
      result = "error: " + error;
    }

    return result;
  }
  async existProduct(id) {
    let product = await this.getProductByID(id);
    if (product.payload != null) {
      return true;
    } else {
      return false;
    }
  }
}

class ProductsReturn {
  status; //:success/error
  payload; //: Resultado de los productos solicitados
  totalPages; //: Total de páginas
  prevPage; //: Página anterior
  nextPage; //: Página siguiente
  page; //: Página actual
  hasPrevPage; //: Indicador para saber si la página previa existe
  hasNextPage; //: Indicador para saber si la página siguiente existe.
  prevLink; //: Link directo a la página previa (null si hasPrevPage=false)
  nextLink; //: Link directo a la página siguiente (null si hasNextPage=false)
}
