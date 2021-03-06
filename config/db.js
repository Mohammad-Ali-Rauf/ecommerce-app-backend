const mongoose = require('mongoose');
const config = require('config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.get("mongoURI"))
        console.log("MongoDB is Connected Successfully");
    } catch (err) {
        console.log("Error ", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;