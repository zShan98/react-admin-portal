const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 6
  },
  nu_id: {
    type: String,
    require: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  whatsapp: {
    type: String,
    required: true,
    minLength: 8
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    required: true,
  }
});

userSchema.pre('save', async function (next) {
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.comparePasswords = async function(incomingPassword) {
  return await bcrypt.compare(incomingPassword, this.password);
}

const User = mongoose.model('user', userSchema);

module.exports = User;
