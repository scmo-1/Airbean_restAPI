import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    prodId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    cartId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    createdBy: {
      type: String,
      required: true,
    },
  },

  { timestamps: true, collection: "cart" }
);

const CartItem = mongoose.model("cartItem", cartItemSchema);
const Cart = mongoose.model("cart", cartSchema);

export { Cart, CartItem, cartItemSchema };
