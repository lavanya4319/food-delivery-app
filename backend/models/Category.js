const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate category names within the same restaurant
categorySchema.index(
  {
    restaurant: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);