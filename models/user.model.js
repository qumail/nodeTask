const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
    },

    hashed_password: {
        type: String,
    },
    salt: String,

},
{
    timestamps: true,
}
);

userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(() => this._password);

  userSchema.methods = {
    authenticate(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
  
    encryptPassword(code) {
      if (!code) return '';
      try {
        const krypo = crypto
          .createHmac('sha1', this.salt)
          .update(code)
          .digest('hex');
        return krypo;
      } catch (err) {
        return '';
      }
    },
  
    makeSalt() {
      return Math.round(new Date().valueOf() * Math.random()) + '';
    },
  };

module.exports = mongoose.model('User', userSchema);