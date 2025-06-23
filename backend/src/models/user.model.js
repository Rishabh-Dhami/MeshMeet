const { mongoose, Schema } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ApiError } = require("../utils/ApiError");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    trim: true,
    select : false
  },
  refreshToken: {
    type: String,
  },
});

userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    { _id: this._id, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  return accessToken;
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = jwt.sign(
    { _id: this._id, username: this.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  this.refreshToken = refreshToken;
  await this.save();
  return refreshToken;
};

userSchema.methods.comparePassword = async function (plainTextPassword) {
  try {
    return await bcrypt.compare(plainTextPassword, this.password);
  } catch (error) {
    throw error;
  }
};

userSchema.pre("save", async function(next){
  if (this.isModified("password") || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      throw new ApiError(400, "Error occur while saving password");
    }
  } else {
    return next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
