// import express from "express";
// import {
//   getFoods,
//   createFood,
//   updateFood,
//   deleteFood,
// } from "../controllers/foodController.js";

// const router = express.Router();

// router.get("/", getFoods);
// router.post("/", createFood);
// router.put("/:id", updateFood);
// router.delete("/:id", deleteFood);

// export default router;

import express from "express";
import {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";
import upload from "../middlewares/uploadMiddleware.js";
// Make sure you create uploadMiddleware.js

// Optional (if you add authentication later):
// import { auth, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * ROUTES:
 * GET    /foods          → Get all foods (with pagination + search)
 * POST   /foods          → Create new food (supports image upload)
 * PUT    /foods/:id      → Update food
 * DELETE /foods/:id      → Delete food
 */

router.get("/", getFoods);

// upload.single("image") → when creating food with image
router.post("/", upload.single("image"), createFood);

router.put("/:id", upload.single("image"), updateFood);

router.delete("/:id", deleteFood);

export default router;
