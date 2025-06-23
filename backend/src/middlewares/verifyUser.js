const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError.js");
const { asyncHandler } = require("../utils/asyncHandler.js");

const verifyUser = asyncHandler(async (req, res, next) => {
  try {
    // Support token from cookies, Authorization header (Bearer), or query param
    let token = req.cookies?.accessToken;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token && req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    let user;
    try {
      user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Unauthorized: Token expired");
      }
      throw new ApiError(401, "Unauthorized: Invalid token");
    }

    if (!user) {
      throw new ApiError(401, "Unauthorized: Invalid token payload");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("[verifyUser]", error);
    next(error);
  }
});

module.exports = { verifyUser };