import { Cart } from "../models/cart.js";
import mongoose from "mongoose";
import { v4 as uuid } from "uuid";
import { calcTotal, calcTotalWithDiscount } from "../utils/utils.js";

export async function getAllCarts() {
  try {
    let carts = await Cart.find();
    return carts;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getCartById(cartId) {
  try {
    let cart = await Cart.findOne({ cartId: cartId });
    if (!cart) return null;

    const totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);

    const totals =
      totalItems >= 3
        ? calcTotalWithDiscount(cart.items)
        : {
            totalBeforeDiscount: calcTotal(cart.items),
            discount: 0,
            total: calcTotal(cart.items),
          };

    if (totals.discount > 0) {
      cart.totalBeforeDiscount = totals.totalBeforeDiscount;
      cart.discount = totals.discount;
    }

    cart.total = totals.total;

    return cart;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getCartByUser(userId) {
  try {
    let cart = await Cart.findOne({ createdBy: userId });
    return cart;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function createOrUpdateCart(id, product) {
  try {
    let cart = await getCartByUser(id);
    if (!cart) {
      cart = await Cart.create({
        cartId: `cart-${uuid().substring(0, 5)}`,
        items: [],
        createdBy: id,
      });
    }
    const item = cart.items.find((i) => i.prodId === product.prodId);
    if (item) {
      item.qty = product.qty;
    } else {
      cart.items.push(product);
    }

    if (product.qty < 1) {
      console.log("item removed");
      cart.items = cart.items.filter((i) => i.prodId !== product.prodId);
    }
    await cart.save();
    return cart;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function removeCart(cartId) {
  try {
    const cart = await Cart.findOneAndDelete({ cartId: cartId });
    return cart;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}
