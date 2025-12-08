import express from "express";
import {
  createKitchen,
  getKitchens,
  getKitchenById,
  updateKitchen,
  deleteKitchen,
} from "../controllers/kitchenController.js";

const router = express.Router();

router.post("/", createKitchen);
router.get("/", getKitchens);
router.get("/:id", getKitchenById);
router.put("/:id", updateKitchen);
router.delete("/:id", deleteKitchen);

export default router;
