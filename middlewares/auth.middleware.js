const { isEmpty } = require('lodash');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (isEmpty(token)) {
      throw 'Token is required';
    }
    const tokenVerification = jwt.verify(
      token.slice(7),
      process.env.JWT_ACCOUNT_ACTIVATION
    );
    
    const username = tokenVerification.username;
    if (!username) {
      throw 'Something went wrong';
    }
    const user = await User.findOne({ username });
    if (isEmpty(user)) {
      throw 'You need to register first';
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

