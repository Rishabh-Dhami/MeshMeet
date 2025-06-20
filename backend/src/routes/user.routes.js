const express = require("express");
const { register, login } = require("../controllers/user.controllers");

const Router = express.Router();

// Route for user login
Router.route("/login").post(login);

// Route for user registration
Router.route("/register").post(register);

module.exports = {
  UserRouter: Router,
};
