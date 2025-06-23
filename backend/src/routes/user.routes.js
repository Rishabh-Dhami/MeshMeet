const express = require("express");
const {
  register,
  login,
  logout,
  refreshAccessToken,
} = require("../controllers/user.controllers");
const { verifyUser } = require("../middlewares/verifyUser");

const Router = express.Router();

// User login route (POST): Authenticates user and issues tokens
Router.route("/login").post(login);

// User registration route (POST): Creates a new user and issues tokens
Router.route("/register").post(register);

// User logout route (GET): Requires authentication, clears tokens and logs out user
Router.route("/logout").get(verifyUser, logout);

// Refresh access token route (GET): Requires authentication, issues new tokens if refresh token is valid
Router.route("/refresh-accesstoken").get(verifyUser, refreshAccessToken);

// Export the router for use in main app
module.exports = {
  UserRouter: Router,
};
