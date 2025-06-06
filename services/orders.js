import Order from "../models/order.js";

export function calculateDeliveryTime() {
  return Math.floor(Math.random() * (60 - 10 + 1)) + "min";
}

export async function getAllOrders() {
  try {
    const orders = await Order.find();
    return orders;
  } catch {
    console.log(error.message);
    return null;
  }
}

export async function getOrderByUserId(userId) {
  try {
    const orders = await Order.find({ user: userId });
    return orders;
  } catch (error) {
    console.log(error.message);
    throw new Error("Could not find order history");
  }
}
