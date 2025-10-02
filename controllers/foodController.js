import Food from "../models/foodModel.js";

// Get all foods
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new food item
export const createFood = async (req, res) => {
  const { name, price, category, description } = req.body;
  try {
    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//update food item
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a food item
export const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
