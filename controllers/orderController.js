import Order from "../models/orderModel.js";
import Food from "../models/foodModel.js";

/**
 * Create order
 * POST /api/orders
 * body: { userId, address, phone, items: [{ foodId, quantity }] }
 */
export const createOrder = async (req, res) => {
  try {
    const { userId, address, phone = "", items } = req.body;
    if (
      !userId ||
      !address ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "userId, address and items are required",
        });
    }

    // Build order items and calculate total
    const orderItems = [];
    let total = 0;
    for (const it of items) {
      const food = await Food.findById(it.foodId);
      if (!food)
        return res
          .status(404)
          .json({ success: false, message: `Food not found: ${it.foodId}` });

      const qty = Number(it.quantity || 1);
      const price = Number(food.price || 0);
      const addons = it.addons || [];

      orderItems.push({
        foodId: food._id,
        name: food.name,
        price,
        quantity: qty,
        addons,
      });

      total +=
        price * qty + (addons.reduce((s, a) => s + (a.price || 0), 0) || 0);
    }

    const order = new Order({
      userId,
      items: orderItems,
      totalPrice: total,
      address,
      phone,
    });
    await order.save();

    res
      .status(201)
      .json({ success: true, message: "Order placed", data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get orders for a user or all orders for admin
 * GET /api/orders?userId=...
 */
export const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get single order
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update order status
 * PUT /api/orders/:id/status
 * body: { status }
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = [
      "placed",
      "preparing",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ];
    if (!allowed.includes(status))
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order status updated", data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
