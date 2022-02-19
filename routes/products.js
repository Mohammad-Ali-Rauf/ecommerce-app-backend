const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcrypt');
const config = require('config');

// @route POST /api/products
// @desc  Add new Product
// @access Private
router.post('/', (req, res) => {
    res.send('This is ')
});

// @route GET /api/products
// @desc  Get All Products
// @access Private
router.get('/', (req, res) => {
    res.send('This is ')
});

// @route GET /api/products/:userID
// @desc  Get User Products
// @access Private
router.get('/', (req, res) => {
    res.send('This is ')
});

// @route PUT /api/products/:id
// @desc  Update A Product
// @access Private
router.put('/', (req, res) => {
    res.send('This is ')
});

// @route DELETE /api/products/:id
// @desc  Delete A Product
// @access Private
router.delete('/', (req, res) => {
    res.send('This is ')
});

module.exports = router;