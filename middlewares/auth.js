const jwt = require('jsonwebtoken');
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("./asyncHandler");

exports.isAuthenticated = asyncHandler(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to Access", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
});