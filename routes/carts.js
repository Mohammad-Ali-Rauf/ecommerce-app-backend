const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// @route GET /api/carts
// @desc  Get User Cart
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ ownerID: req.user.id }).select({
      __v: 0,
    });
    res.status(200).json({ cart });
  } catch (err) {
    console.log("Error ", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route PUT /api/products/:id
// @desc  Update A Product
// @access Private
router.put(
    "/:id",
    [auth, [
      check("products", "Please Enter a vaild data").isArray(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      let product = await Product.findById(req.params.id.trim());

      if (!product) {
        return res.status(400).json({ msg: "Product does not exist." });
      }

      if (product.ownerID.toString() !== req.user.id.trim()) {
        return res
          .status(401)
          .json({ msg: "User have not access to update this product." });
      }

      const { title, quantity, price, category, description } = req.body;

      const changes = {
        title,
        quantity,
        price,
        category,
        description,
      };

      product = await Product.findByIdAndUpdate(
        req.params.id.trim(),
        { $set: changes },
        { new: true }
      );

      res.status(200).json({
        product,
      });
    } catch (err) {
      console.log("Error ", err);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route DELETE /api/products/:id
// @desc  Delete A Product
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id.trim());

    if (!product) {
      return res.status(400).json({ msg: "Product does not exist." });
    }

    if (product.ownerID.toString() !== req.user.id.trim()) {
      return res
        .status(401)
        .json({ msg: "User have not access to update this product." });
    }

    product = await Product.findByIdAndRemove(req.params.id.trim());

    res.status(200).json({
      msg: "The Product has been deleted",
    });
  } catch (err) {
    console.log("Error ", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
