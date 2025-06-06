import mongoose from "mongoose";
import { cartItemSchema } from "./cart.js";

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: String,
      required: true,
    },
    discountedTotal: {
      type: String,
      required: false,
    },
    user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
