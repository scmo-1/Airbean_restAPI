import { Router } from "express";
import {
  getAllCarts,
  getCartById,
  createOrUpdateCart,
  getCartByUser,
} from "../services/cart.js";
import { v4 as uuid } from "uuid";
import { getProductByProdId } from "../services/products.js";
import { calcTotal } from "../utils/utils.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/authorizeUser.js";
import { getUserFromRequest } from "../utils/utils.js";

const router = Router();

router.get("/", authenticateUser, authenticateAdmin, async (req, res, next) => {
  const allCarts = await getAllCarts();
  if (Array.isArray(allCarts)) {
    res.status(200).json({
      success: true,
      message: `Cart(s) retrieved successfully. Number of carts: ${allCarts.length}`,
      data: allCarts,
    });
  } else {
    next({
      status: 500,
      message: "Server error",
    });
  }
});

//GET cart by cartId
router.get("/:cartId", async (req, res, next) => {
  const { cartId } = req.params;
  const user = await getUserFromRequest(req);
  const cart = await getCartById(cartId);

  if (!cartId) {
    next({
      status: 400,
      message: "Cart ID must be provided",
    });
  }
  if (!cart) {
    next({
      status: 404,
      message: "No cart found",
    });
  }

  if (user && cart.createdBy !== user.userId) {
    next({
      status: 401,
      message: "Not authorized to access this cart.",
    });
  }

  if (!user && cart.createdBy.includes("user")) {
    return next({
      status: 401,
      message: "Not authorized to access this cart.",
    });
  }

  if (cartId) {
    if (cart) {
      res.status(200).json({
        success: true,
        message: "Cart retrieved successfully",
        data: cart,
        total: `${calcTotal(cart.items)} SEK`,
        discountedTotal: `${cart.total} SEK`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No cart found",
      });
    }
  }
});

//PUT update cart
router.put("/", async (req, res, next) => {
  const { prodId, qty, guestId } = req.body;
  if (prodId === undefined || qty === undefined) {
    next({
      status: 400,
      message: "Product ID and quantity must be provided",
    });
  }

  const product = await getProductByProdId(prodId);
  if (!product) {
    next({
      status: 404,
      message: `Product with ID: "${prodId}" not found in menu`,
    });
  }

  const user = await getUserFromRequest(req);

  if (user) {
    let cart = await getCartByUser(user.userId);
    if (!cart) {
      const newCart = await createOrUpdateCart(user.userId, {
        prodId: product.prodId,
        title: product.title,
        price: product.price,
        qty: qty,
      });

      if (!newCart) {
        return next({
          status: 500,
          message: "Server error. No cart created",
        });
      }

      return res.status(201).json({
        success: true,
        message: "New cart created",
        cart: newCart,
        total: `${calcTotal(newCart.items)} SEK`,
      });
    }
    const updatedCart = await createOrUpdateCart(user.userId, {
      prodId: product.prodId,
      title: product.title,
      price: product.price,
      qty: qty,
    });
    if (!updatedCart) {
      return next({
        status: 500,
        message: "Server error. No cart created",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: updatedCart,
      total: `${calcTotal(updatedCart.items)} SEK`,
    });
  } else {
    if ("guestId" in req.body) {
      let cart = await getCartByUser(guestId);
      if (!cart) {
        next({
          status: 404,
          message: "No cart found with provided guest ID",
        });
      } else {
        const updatedGuestCart = await createOrUpdateCart(guestId, {
          prodId: product.prodId,
          title: product.title,
          price: product.price,
          qty: qty,
        });
        res.status(200).json({
          success: true,
          message: `Cart updated`,
          guestId: guestId,
          cart: updatedGuestCart,
          total: `${calcTotal(updatedGuestCart.items)} SEK`,
        });
      }
    } else {
      const newGuestId = `guest-${uuid().substring(0, 5)}`;
      const newGuestCart = await createOrUpdateCart(newGuestId, {
        prodId: product.prodId,
        title: product.title,
        price: product.price,
        qty: qty,
      });
      res.status(201).json({
        success: true,
        guestId: newGuestId,
        message: "New guest cart created",
        cart: newGuestCart,
        total: `${calcTotal(newGuestCart.items)} SEK`,
      });
    }
  }
});

export default router;
