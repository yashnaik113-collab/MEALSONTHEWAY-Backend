// import Food from "../models/foodModel.js";

// // Get all foods
// export const getFoods = async (req, res) => {
//   try {
//     const foods = await Food.find();
//     res.json(foods);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create a new food item
// export const createFood = async (req, res) => {
//   const { name, price, category, description } = req.body;
//   try {
//     const newFood = new Food(req.body);
//     await newFood.save();
//     res.status(201).json(newFood);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// //update food item
// export const updateFood = async (req, res) => {
//   try {
//     const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.json(food);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a food item
// export const deleteFood = async (req, res) => {
//   try {
//     await Food.findByIdAndDelete(req.params.id);
//     res.json({ message: "Food item deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Food from "../models/foodModel.js";
import Joi from "joi";

// ---------------- Validation Schema ----------------

const foodValidation = Joi.object({
  name: Joi.string().min(2).required(),
  price: Joi.number().min(1).required(),
  category: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  imageUrl: Joi.string().optional(),
  isAvailable: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  rating: Joi.number().min(1).max(5).optional(),
  addons: Joi.array()
    .items(
      Joi.object({
        name: Joi.string(),
        price: Joi.number().min(1),
      })
    )
    .optional(),
});

// ---------------- Get all foods (with search + pagination) ----------------

export const getFoods = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    const query = search
      ? {
          name: { $regex: search, $options: "i" },
        }
      : {};

    const foods = await Food.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Food.countDocuments(query);

    res.json({
      success: true,
      data: foods,
      pagination: {
        currentPage: Number(page),
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Create a new food item ----------------

export const createFood = async (req, res) => {
  try {
    let foodData = req.body;

    if (req.file) {
      foodData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const { error } = foodValidation.validate(foodData);
    if (error)
      return res.status(400).json({ success: false, message: error.message });

    const newFood = new Food(foodData);
    await newFood.save();

    res.status(201).json({
      success: true,
      message: "Food item created successfully",
      data: newFood,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Update food item ----------------

export const updateFood = async (req, res) => {
  try {
    let updateData = req.body;

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const food = await Food.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });

    res.json({
      success: true,
      message: "Food updated successfully",
      data: food,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Delete food item ----------------

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });

    res.json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
