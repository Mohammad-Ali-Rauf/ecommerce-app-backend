const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcrypt');
const config = require('config');
const auth = require('../middleware/auth');

// @route POST /api/products
// @desc  Add new Product
// @access Private
router.post('/', [
    check('title', 'Title is Required').not().isEmpty(),
    check('quantity', 'Quantity is Required').isNumeric(),
    check('price', 'Price is Required').isNumeric(),
    check('category', 'Category is Required').not().isEmpty(),
    check('description', 'Description is Required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) 
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
        res.status(500).json({ msg: "Server Error" })
    }
});

// @route GET /api/products
// @desc  Get All Products
// @access Private
router.get('/', (req, res) => {
    
});

// @route GET /api/products/:userID
// @desc  Get User Products
// @access Private
router.get('/', (req, res) => {
    
});

// @route PUT /api/products/:id
// @desc  Update A Product
// @access Private
router.put('/', (req, res) => {
    
});

// @route DELETE /api/products/:id
// @desc  Delete A Product
// @access Private
router.delete('/', (req, res) => {
    
});

module.exports = router;