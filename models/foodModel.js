// import mongoose from "mongoose";

// const foodSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     category: {
//       type: String,
//       required: true,
//     },
//     description: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Food", foodSchema);

import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["veg", "non-veg", "beverages", "snacks", "dessert", "other"],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },

    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
      required: false, // keep optional until you add kitchen model
    },

    addons: [
      {
        name: String,
        price: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);
