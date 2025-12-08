import Cart from "../models/cartModel.js";
import Food from "../models/foodModel.js";
import mongoose from "mongoose";

/**
 * Helper: fetch or create cart for userId
 */
async function findOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }
  return cart;
}

/**
 * Get cart by userId
 * GET /api/carts/:userId
 */
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });

    const cart = await Cart.findOne({ userId }).populate(
      "items.foodId",
      "name"
    );
    if (!cart)
      return res.json({ success: true, data: { items: [], totalAmount: 0 } });

    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Add an item to cart (or increment quantity if exists)
 * POST /api/carts/:userId/add
 * body: { foodId, quantity (optional), addons (optional) }
 */
export const addItemToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { foodId, quantity = 1, addons = [] } = req.body;

    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(foodId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId or foodId" });
    }

    const food = await Food.findById(foodId);
    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });

    const cart = await findOrCreateCart(userId);

    // see if item already exists in cart (match by foodId + same addons signature)
    const existingIndex = cart.items.findIndex(
      (it) => it.foodId.toString() === foodId.toString()
    );
    if (existingIndex > -1) {
      // increment quantity
      cart.items[existingIndex].quantity += Number(quantity);
      // optionally update price or name if changed
      cart.items[existingIndex].price = food.price;
    } else {
      cart.items.push({
        foodId,
        name: food.name,
        price: food.price,
        quantity: Number(quantity),
        addons,
      });
    }

    await cart.save();
    res
      .status(201)
      .json({ success: true, message: "Item added to cart", data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update item quantity
 * PUT /api/carts/:userId/item/:itemId
 * body: { quantity }
 */
export const updateItemQuantity = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(itemId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId or itemId" });
    }
    if (!quantity || Number(quantity) < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });

    item.quantity = Number(quantity);
    await cart.save();

    res.json({ success: true, message: "Cart item updated", data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Remove a single item from cart
 * DELETE /api/carts/:userId/item/:itemId
 */
export const removeItemFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(itemId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId or itemId" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });

    item.remove();
    await cart.save();

    res.json({ success: true, message: "Item removed from cart", data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Clear cart (remove all items)
 * DELETE /api/carts/:userId
 */
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ success: true, message: "Cart cleared", data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
