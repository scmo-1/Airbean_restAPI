import { Router } from "express";
import { calculateDeliveryTime } from "../services/orders.js";
import Order from "../models/order.js";
import { getAllOrders, getOrderByUserId } from "../services/orders.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/authorizeUser.js";
import { getCartById, removeCart } from "../services/cart.js";
import { calcTotal } from "../utils/utils.js";
import { v4 as uuid } from "uuid";
import { getUserFromRequest } from "../utils/utils.js";
import { getUserById } from "../services/users.js";

const router = Router();

//GET orders for admin / user
router.get("/", authenticateUser, async (req, res, next) => {
  const user = await getUserById(req.user.userId);
  let orders;
  if (user.role === "admin") {
    orders = await getAllOrders();
  } else if (user.role === "user") {
    orders = await getOrderByUserId(user.userId);
  } else {
    return next({
      status: 500,
      message: "Server error",
    });
  }
  return res.status(200).json({
    success: true,
    message: `Orders fetched successfully. Number of orders: ${orders.length}`,
    orders: orders,
  });
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

    const user = await getUserFromRequest(req);

    if (user) {
      const order = new Order({
        orderId: `order-${uuid().substring(0, 5)}`,
        items: cart.items,
        totalAmount: `${calcTotal(cart.items)} SEK`,
        discountedTotal: `${cart.total} SEK`,
        user: user.userId,
      });

      await order.save();

      res.status(201).json({
        success: true,
        order,
        message: `Order created successfully`,
        time: calculateDeliveryTime(),
      });
      removeCart(cartId);
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
        message: "Order created successfully",
        time: calculateDeliveryTime(),
      });
      removeCart(cartId);
    }
  } catch (error) {
    next(error);
  }
});

export default router;

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
