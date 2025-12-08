import express from "express";
import {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

/**
 * Routes:
 * GET    /api/carts/:userId                → get user cart
 * POST   /api/carts/:userId/add            → add item to cart
 * PUT    /api/carts/:userId/item/:itemId   → update qty
 * DELETE /api/carts/:userId/item/:itemId   → remove item
 * DELETE /api/carts/:userId                → clear cart
 *
 * Note: In a real app you would protect these with auth middleware (use req.user.id)
 */

router.get("/:userId", getCart);
router.post("/:userId/add", addItemToCart);
router.put("/:userId/item/:itemId", updateItemQuantity);
router.delete("/:userId/item/:itemId", removeItemFromCart);
router.delete("/:userId", clearCart);

export default router;
