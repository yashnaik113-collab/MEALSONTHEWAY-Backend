import express from "express";
import {
  signup,
  login,
  getUsers,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

// Auth
router.post("/signup", signup);
router.post("/login", login);

// Users
router.get("/", getUsers);
router.get("/:id", getUserById);

export default router;
