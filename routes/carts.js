const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
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

// @route PUT /api/carts/:productID
// @desc  Update Cart Product
// @access Private
router.put(
  "/:productID",
  [
    auth,
    [check("selectedQuantity", "Please Enter a vaild Quantity.").isNumeric()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      let cart = await Cart.findById(req.user.id);

      if (!cart) {
        return res.status(400).json({ msg: "Cart does not exist." });
      }

      let productFound = false;

      cart.products.forEach((product) => {
        if (product.id === req.params.id) productFound = true;
      });

      if (!productFound) {
        res.status(400).json({ msg: "Product does not exist in your cart." });
      }

      cart.products = cart.products.map(async (product) => {
        if (product.id === req.params.productID) {
          try {
            let sellerProduct = await Product.findById(req.params.productID);

            if (!sellerProduct) {
              res
                .status(400)
                .json({ msg: "Product does not exist on Seller end." });
            }

            if (req.body.selectedQuantity > sellerProduct.quantity) {
              res.status(400).json({ msg: "Out of Stock" });
            }

            product.selectedQuantity = req.body.selectedQuantity;
          } catch (err) {
            console.log("Error", err);
            res.status(500).json({ msg: "Server Error" });
          }
        }
        return product;
      });

      const changes = {
        products: [...cart.products],
      };

      cart = await Cart.findByIdAndUpdate(
        cart.id.trim(),
        { $set: changes },
        { new: true }
      );

      res.status(200).json({
        cart,
      });
    } catch (err) {
      console.log("Error ", err);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route DELETE /api/carts/:productID
// @desc  Delete Cart Product
// @access Private
router.delete("/:productID", auth, async (req, res) => {
  try {
    let cart = await Cart.findById(req.user.id);

    if (!cart) {
      return res.status(400).json({ msg: "Cart does not exist." });
    }

    let productFound = false;

    cart.products.forEach((product) => {
      if (product.id === req.params.id) productFound = true;
    });

    if (!productFound) {
      res.status(400).json({ msg: "Product does not exist in your cart." });
    }

    cart.products = cart.products.filter(
      (product) => product.productID !== req.params.productID
    );

    const changes = {
      products: [...cart.products],
    };

    cart = await Cart.findByIdAndUpdate(
      cart.id.trim(),
      { $set: changes },
      { new: true }
    );

    res.status(200).json({
      cart,
    });
  } catch (err) {
    console.log("Error ", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route DELETE /api/carts/buy
// @desc  Buy All Cart Products
// @access Private
router.delete("/buy", auth, async (req, res) => {
  try {
    let cart = await Cart.findById(req.user.id);

    if (!cart) {
      return res.status(400).json({ msg: "Cart does not exist." });
    }

    cart.products.map(async (product) => {
      let sellerProduct = await Product.findById(product.productID);
      if (product.selectedQuantity > sellerProduct.quantity) {
        return res.status(400).json({
          msg: `Product ${sellerProduct.title} has ${sellerProduct.quantity}units available only.`,
        });
      }
    });

    cart.products.map(async (product) => {
      let sellerProduct = await Product.findById(product.productID);
      await Product.findByIdAndUpdate(
        product.productID,
        {
          $set: {
            quantity: sellerProduct.quantity - product.selectedQuantity,
          },
        },
        { new: true }
      );
      let orders = await Order.findOne({ ownerID: req.user.id });
      await Order.findByIdAndUpdate(
        orders.id,
        {
          $set: {
            products: [
              ...orders.products,
              {
                productID: product.productID,
                buyQuantity: product.selectedQuantity,
                buyerID: req.user.id,
              },
            ],
          },
        },
        { new: true }
      );
    });

    const changes = {
      products: [],
    };

    cart = await Cart.findByIdAndUpdate(
      cart.id.trim(),
      { $set: changes },
      { new: true }
    );

    res.status(200).json({
      cart,
    });
  } catch (err) {
    console.log("Error ", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
