import { Router } from "express";
import Product from "../models/product.js";
import {
  authenticateUser,
  authenticateAdmin,
} from "../middlewares/authorizeUser.js";
import {
  getProductByProdId,
  createNewProduct,
  updateProduct,
  deleteProduct,
} from "../services/products.js";

const router = Router();

// GET menu
router.get("/", async (req, res, next) => {
  console.log("Received request to GET /api/menu");

  try {
    const products = await Product.find();
    console.log("Products found:", products.length);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

    return res.status(200).json({
      success: true,
      menu: products,
    });
  } catch (err) {
    console.error("Failed to fetch products:", err);
    next({
      status: 500,
      message: "Server error",
    });
  }
});

// PUT product
router.put(
  "/:prodId",
  authenticateUser,
  authenticateAdmin,
  async (req, res, next) => {
    const { prodId } = req.params;
    const { title, price, desc } = req.body;
    if (!prodId) {
      return next({
        status: 400,
        message: "Product ID must be provided",
      });
    }
    if (!title || !price || !desc) {
      return next({
        status: 400,
        message: "All product data must be provided",
      });
    }
    const updatedProduct = await updateProduct(prodId, {
      title: title,
      price: price,
      desc: desc,
    });

    if (updatedProduct) {
      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } else {
      return next({
        status: 400,
        message: "Product could not be updated",
      });
    }
  }
);

// POST product
router.post(
  "/",
  authenticateUser,
  authenticateAdmin,
  async (req, res, next) => {
    const { title, desc, price } = req.body;
    if (!title || !price) {
      return next({
        status: 400,
        message: "Product title and price must be provided",
      });
    }
    const newProduct = await createNewProduct({
      title: title,
      desc: desc,
      price: price,
    });

    if (newProduct) {
      return res.status(201).json({
        success: true,
        message: "New product created successfully",
        product: newProduct,
      });
    } else {
      return next({
        status: 400,
        message: "Product could not be created",
      });
    }
  }
);

// DELETE product
router.delete(
  "/:prodId",
  authenticateUser,
  authenticateAdmin,
  async (req, res, next) => {
    const { prodId } = req.params;
    if (!prodId) {
      return next({
        status: 400,
        message: "Product ID must be provided",
      });
    }

    const removedProduct = await deleteProduct(prodId);

    if (!removedProduct) {
      return next({
        status: 400,
        message: `No product found with ID: '${prodId}' `,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Product: ${prodId} deleted successfully`,
    });
  }
);

export default router;
