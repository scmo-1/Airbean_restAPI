import { Router } from "express";
import { calculateDeliveryTime } from "../services/orders.js";
import Order from "../models/order.js";
import { getAllOrders, getOrderByUserId } from "../services/orders.js";
import { authenticateUser } from "../middlewares/authorizeUser.js";
import { getCartById } from "../services/cart.js";
import { calcTotal } from "../utils/utils.js";
import { v4 as uuid } from "uuid";

const router = Router();

//GET all orders
router.get("/", async (req, res, next) => {
  const orders = await getAllOrders();
  if (orders) {
    res.json({
      success: true,
      orders: orders,
      message: `Orders fetched successfully. Number of orders: ${orders.length}`,
    });
  } else {
    next({
      status: 500,
      message: "Server error",
    });
  }
});

//GET orders by userID
router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const orders = await getOrderByUserId(userId);

    if (!orders || orders.length === 0) {
      return next({
        status: 404,
        message: "No orders found for this user",
      });
    }
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

//POST create order from a cart
router.post("/", async (req, res, next) => {
  const { cartId } = req.body;
  try {
    if (!cartId)
      return res.status(400).json({
        success: false,
        message: "CartId required",
      });

    const cart = await getCartById(cartId);

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart empty or not found",
      });
    }

    if (global.user) {
      const order = new Order({
        orderId: `order-${uuid().substring(0, 5)}`,
        items: cart.items,
        totalAmount: `${calcTotal(cart.items)} SEK`,
        discountedTotal: `${cart.total} SEK`,
        user: global.user.userId,
      });

      await order.save();

      res.status(201).json({
        success: true,
        order,
        message: `Order created for user: ${global.user.userId}`,
        time: calculateDeliveryTime(),
      });
      cart.items = [];
      await cart.save();
    } else {
      const order = new Order({
        orderId: `order-${uuid().substring(0, 5)}`,
        items: cart.items,
        totalAmount: `${calcTotal(cart.items)} SEK`,
        discountedTotal: `${cart.total} SEK`,
        user: "guest",
      });
      await order.save();

      res.status(201).json({
        success: true,
        order,
        message: "Order created",
        time: calculateDeliveryTime(),
      });
      cart.items = [];
      await cart.save();
    }
  } catch (error) {
    next(error);
  }
});

export default router;
