import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Place an order
router.post("/", createOrder);

// List orders, optional ?userId=
router.get("/", getOrders);

// Single order
router.get("/:id", getOrderById);

// Update status
router.put("/:id/status", updateOrderStatus);

export default router;
