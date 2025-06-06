import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  prodId: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String },
  price: { type: Number, required: true },
});

const Product = mongoose.model("Product", productSchema, "menu");

export default Product;
