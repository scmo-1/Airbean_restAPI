import { Router } from "express";
import Product from "../models/product.js";

const router = Router();

// GET menu
router.get('/', async (req, res, next) => {
    console.log("Received request to GET /api/menu");
  
    try {
      const products = await Product.find();
      console.log("Products found:", products.length);
  
      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No products found."
        });
      }
  
      res.status(200).json({
        success: true,
        menu: products
      });
  
    } catch (err) {
      console.error("Failed to fetch products:", err);
      next({
        status: 500,
        message: "Server error"
      });
    }
  });
  

export default router;
