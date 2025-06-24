const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { User } = require("../models/user.model.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const jwt = require('jsonwebtoken');

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

const logout = asyncHandler(async (req, res, next) => {
  const { _id } = req?.user;

  if (!_id) {
    throw new ApiError(401, "Unauthorized Request");
  }

  const user = await User.findByIdAndUpdate(
    _id,
    { refreshToken: null },
    { new: true },
  );

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logout successfully!", user));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.headers['x-refresh-token'] || req.query.refreshToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized: No refresh token provided!");
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(401, "Unauthorized: Refresh token expired!");
      }
      throw new ApiError(401, "Unauthorized: Invalid refresh token!");
    }

    console.log("payload", payload)

    const user = await User.findById(payload._id);
    if (!user) {
      throw new ApiError(404, "User not found!");
    }

    // Check if the refresh token matches the one stored in the database
    if (user.refreshToken !== token) {
      throw new ApiError(401, "Unauthorized: Refresh token mismatch!");
    }

    const { refreshToken, accessToken } = await generateAccessTokenAndRefreshToken(user._id);
    // Save the new refresh token to the user document
    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "AccessToken refreshed successfully", {
          user,
          refreshToken,
          accessToken,
        })
      );
  } catch (error) {
    next(error);
  }
});

module.exports = { register, login, logout, refreshAccessToken };
