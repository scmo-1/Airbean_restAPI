import Product from "../models/product.js";
import { v4 as uuid } from "uuid";

export async function getProductByProdId(prodId) {
  try {
    const product = await Product.findOne({ prodId: prodId });
    if (!product) throw new Error("No product found");

    return product;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createNewProduct(product) {
  try {
    const newProduct = await Product.create({
      prodId: `prod-${uuid().substring(0, 5)}`,
      title: product.title,
      price: product.price,
      desc: product.desc,
    });

    return newProduct;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function updateProduct(prodId, product) {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { prodId: prodId },
      {
        title: product.title,
        desc: product.dec,
        price: product.price,
      }
    );
    if (!updatedProduct) throw new Error("Product update failed:");

    return updatedProduct;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function deleteProduct(prodId) {
  try {
    const product = await Product.findOneAndDelete({ prodId: prodId });
    if (!product) throw new Error("Product deletion failed:");

    return product;
  } catch (error) {
    console.log(error.message);
  }
}
