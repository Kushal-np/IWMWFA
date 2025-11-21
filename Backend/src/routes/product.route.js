import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getMyListings,
  updateProduct,
  deleteProduct,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createOrder,
  getMyOrders,
  getMySales,
  getOrderById,
  updateOrderStatus,
  addToCart,
} from "../controllers/product.controller.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getAllProducts); // Home page - all products
router.get("/:id", getProductById); // Single product detail

router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("user", "business"),
  upload.array("images", 5), // Max 5 images
  createProduct
);

router.get(
  "/my/listings",
  isAuthenticated,
  authorizeRoles("user", "business"),
  getMyListings
);

router.put(
  "/:id",
  isAuthenticated,
  authorizeRoles("user", "business"),
  updateProduct
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("user", "business"),
  deleteProduct
);

// ============ CART ROUTES ============
router.post(
  "/cart/add",
  isAuthenticated,
  authorizeRoles("user", "business"),
  addToCart
);

router.get(
  "/cart/get",
  isAuthenticated,
  authorizeRoles("user", "business"),
  getCart
);

router.put(
  "/cart/update",
  isAuthenticated,
  authorizeRoles("user", "business"),
  updateCartItem
);

router.delete(
  "/cart/remove/:productId",
  isAuthenticated,
  authorizeRoles("user", "business"),
  removeFromCart
);

router.delete(
  "/cart/clear",
  isAuthenticated,
  authorizeRoles("user", "business"),
  clearCart
);

// ============ ORDER ROUTES ============
router.post(
  "/orders/create",
  isAuthenticated,
  authorizeRoles("user", "business"),
  createOrder
);

router.get(
  "/orders/my-orders",
  isAuthenticated,
  authorizeRoles("user", "business"),
  getMyOrders
);

router.get(
  "/orders/my-sales",
  isAuthenticated,
  authorizeRoles("user", "business"),
  getMySales
);

router.get(
  "/orders/:id",
  isAuthenticated,
  authorizeRoles("user", "business"),
  getOrderById
);

router.put(
  "/orders/:id/status",
  isAuthenticated,
  authorizeRoles("user", "business"),
  updateOrderStatus
);

export default router;