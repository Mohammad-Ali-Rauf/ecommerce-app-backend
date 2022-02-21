const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const config = require("config");
const auth = require("../middleware/auth");
const res = require("express/lib/response");

// @route POST /api/products
// @desc  Add new Product
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is Required").not().isEmpty(),
      check("quantity", "Quantity is Required").isNumeric(),
      check("price", "Price is Required").isNumeric(),
      check("category", "Category is Required").not().isEmpty(),
      check("description", "Description is Required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { title, quantity, price, category, description } = req.body;

      const product = new Product({
        ownerID: req.user.id,
        title,
        quantity,
        price,
        category,
        description,
      });

      await product.save();

      res.status(200).json({ product });
    } catch (err) {
      console.log("Error ", err);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route GET /api/products
// @desc  Get All Products
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find().select({ __v: 0 });
    res.status(200).json({ products });
  } catch (err) {
    console.log("Error ", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route GET /api/products/:userID
// @desc  Get User Products
// @access Private
router.get("/:userID", auth, async (req, res) => {
  try {
    if (req.params.userID !== req.user.id) {
      return res.status(401).json({ msg: "User is not Authorized" });
    }

    const products = await Product.findOne({
      ownerID: req.params.userID,
    }).select({ __v: 0 });
    res.status(200).json({ products });
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
  [
    auth,
    [
      check("title", "Title is Required").not().isEmpty(),
      check("quantity", "Quantity is Required").isNumeric(),
      check("price", "Price is Required").isNumeric(),
      check("category", "Category is Required").not().isEmpty(),
      check("description", "Description is Required").not().isEmpty(),
    ],
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
      msg: 'The Product has been deleted',
    });
  } catch (err) {
    console.log("Error ", err);
    res.status(500).json({ msg: "Server Error" });
  }
});
module.exports = router;
