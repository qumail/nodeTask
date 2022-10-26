const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.create({
            username,
            password,
          });
      
        user.save();

        res.json({ username });
        return;

    } catch(error) {
        return error;
    }

};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.json({
              errors: 'Username or password is wrong',
            });
        }

        if (!user.authenticate(password)) {
            return res.json({
              errors: 'Username and password do not match',
            });
        }

        const token = jwt.sign(
            {
              username
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
              expiresIn: '365d',
            }
        );

        res.json({ username, token });
        return;

        

    } catch(error) {
        return error;
    }
};