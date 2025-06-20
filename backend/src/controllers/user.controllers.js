const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { User } = require("../models/user.model.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

// Generate access and refresh tokens for a user
async function generateAccessTokenAndRefreshToken(user_id) {
  if (!user_id) {
    throw new ApiError(400, "User_id is required to generate tokens");
  }

  const user = await User.findById(user_id);

  if (!user) {
    throw new ApiError(404, "User not found while generating tokens");
  }

  const refreshToken = await user.generateRefreshToken();
  const accessToken = await user.generateAccessToken();

  if (!refreshToken || !accessToken) {
    throw new ApiError(500, "Error occurred while generating tokens");
  }

  return {
    accessToken,
    refreshToken,
  };
}

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = asyncHandler(async (req, res, next) => {
  const { name, username, password } = req.body;

  // Check for required fields
  if (!name || !username || !password) {
    throw new ApiError(400, "All fields are required!");
  }

  const userAlredyExits = await User.findOne({ username });

  if (userAlredyExits) {
    throw new ApiError(409, "User already exists!");
  }

  const user = await User.create({
    name,
    username,
    password,
  });

  if (!user) {
    throw new ApiError(500, "Error occurred while registering  the user");
  }

  const registedUser = await User.findOne({ _id: user._id });

  if (!registedUser) {
    throw new ApiError(500, "Error occurred while registering the user");
  }

  // Generate tokens for the new user
  const { refreshToken, accessToken } =
    await generateAccessTokenAndRefreshToken(registedUser._id);

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(201, "User registered successfully!", {
        user: registedUser,
        refreshToken,
        accessToken,
      })
    );
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Check for required fields
  if (!username || !password) {
    throw new ApiError(400, "All fields are required!");
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  // Validate password
  const checkPassword = await user.comparePassword(password);

  if (!checkPassword) {
    throw new ApiError(401, "Invalid password!");
  }

  const loggedInUser = await User.findById(user._id);

  if (!loggedInUser) {
    throw new ApiError(500, "Error occurred while logging the user");
  }

  // Generate tokens for the logged-in user
  const { refreshToken, accessToken } =
    await generateAccessTokenAndRefreshToken(loggedInUser._id);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully!", {
        user: loggedInUser,
        refreshToken,
        accessToken,
      })
    );
});

module.exports = { register, login };
