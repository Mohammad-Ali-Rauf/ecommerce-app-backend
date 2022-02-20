const express = require('express');
const app = express();
const connectDB = require('./config/db');
// const cors = require('cors');

// app.use(cors());
app.use(express.json({ extended : false }));

connectDB();


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.status(200).json({ msg: "This is a ecommerce app" })
});

app.use("/api/auth", require('./routes/auth'));
app.use("/api/users", require('./routes/users'));
app.use("/api/products", require('./routes/products'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});