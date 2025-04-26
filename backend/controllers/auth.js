const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports.login = async (req, res, next) => {
  const { nu_id, password } = req.body;

  if (!nu_id || !password)
    return next({ statusCode: 400, message: 'Invalid body parameters.' });

  const user = await User.findOne({ nu_id });
  if (!user)
    return next({ statusCode: 401, message: 'Auth failed.', debug: 'user dne' });

  const matches = await user.comparePasswords(password);
  if (!matches)
    return next({ statusCode: 401, message: 'Auth failed.', debug: 'password err' });

  const token = jwt.sign(
    {
      nu_id,
      user_id: user._id,
      role: user.role,
    },
    process.env.JWT_KEY,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token
  });
}

module.exports.signup = async (req, res, next) => {
  const { nu_id, name, password, whatsapp, code } = req.body;

  if (!nu_id || !name || !password || !whatsapp)
    return next({ statusCode: 400, message: 'Invalid body parameters.' });

  const user = await User.findOne({ nu_id });
  if (!!user)
    return next({ statusCode: 409, message: 'User already exists.' });

  const role = code && code === process.env.ADMIN_ROLE_CODE ? 'admin' : 'member';
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    name,
    nu_id,
    password,
    whatsapp,
    role
  });

  await newUser.save();

  const token = jwt.sign(
    {
      nu_id,
      user_id: newUser._id,
      role,
    },
    process.env.JWT_KEY,
    { expiresIn: '1d' }
  );

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    token
  });
}