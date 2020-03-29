const mongoose = require('mongoose');
const path = require('path');
const env = require(path.join(__dirname, '../utils/env'));
mongoose.connect(env.mongo, { useNewUrlParser: true });
module.exports = mongoose;
