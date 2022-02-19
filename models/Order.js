const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }, 
    products: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        buyQuantity: {
            type: Number,
            required: true,
        },
        buyerID: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            name: {
                type: String,
                required: true,
            }
        }
    }],
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('order', OrderSchema)