const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL);
module.exports = mongoose.connection;
