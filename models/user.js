const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      favoriteBook: {
        type: String,
        required: true,
        trim: true
      },
      password: {
        type: String,
        required: true
      },
});

//has password before saving to db
//pre save hook(a function that runs before a record is saveds):
UserSchema.pre('save', function(next){
  const user = this;
  bcrypt.hash(user.password, 10, (err,hash)=>{
    if(err){
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User',UserSchema);
module.exports = User;