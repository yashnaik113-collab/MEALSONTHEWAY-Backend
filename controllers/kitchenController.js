import Kitchen from "../models/kitchenModel.js";

/**
 * Create kitchen
 * POST /api/kitchens
 */
export const createKitchen = async (req, res) => {
  try {
    const {
      name,
      address = "",
      phone = "",
      isOpen = true,
      openingHours = "",
      coordinates,
    } = req.body;
    const kitchen = new Kitchen({
      name,
      address,
      phone,
      isOpen,
      openingHours,
      location: coordinates ? { type: "Point", coordinates } : undefined,
    });
    await kitchen.save();
    res
      .status(201)
      .json({ success: true, message: "Kitchen created", data: kitchen });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get list of kitchens
 * GET /api/kitchens
 */
export const getKitchens = async (req, res) => {
  try {
    const kitchens = await Kitchen.find().sort({ createdAt: -1 });
    res.json({ success: true, data: kitchens });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get single kitchen
 * GET /api/kitchens/:id
 */
export const getKitchenById = async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.id);
    if (!kitchen)
      return res
        .status(404)
        .json({ success: false, message: "Kitchen not found" });
    res.json({ success: true, data: kitchen });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update kitchen
 * PUT /api/kitchens/:id
 */
export const updateKitchen = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.coordinates) {
      updates.location = { type: "Point", coordinates: updates.coordinates };
      delete updates.coordinates;
    }
    const kitchen = await Kitchen.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!kitchen)
      return res
        .status(404)
        .json({ success: false, message: "Kitchen not found" });
    res.json({ success: true, message: "Kitchen updated", data: kitchen });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete kitchen
 * DELETE /api/kitchens/:id
 */
export const deleteKitchen = async (req, res) => {
  try {
    const kitchen = await Kitchen.findByIdAndDelete(req.params.id);
    if (!kitchen)
      return res
        .status(404)
        .json({ success: false, message: "Kitchen not found" });
    res.json({ success: true, message: "Kitchen deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
