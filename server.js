import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import foodRoutes from "./routes/foodRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/foods", foodRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
