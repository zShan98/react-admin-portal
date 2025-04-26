const mongoose = require('mongoose');

const dbUri = process.env.DATABASE_URL;

module.exports.connect = async () => await mongoose.connect(dbUri);
