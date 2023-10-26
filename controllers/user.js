const User = require('../models/user');
const asyncHandler = require('../middlewares/asyncHandler');
const sendCookie = require('../utils/sendCookie');
const ErrorHandler = require('../utils/errorHandler');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');
// const cloudinary = require("cloudinary  ")

// Signup User
const signupUser = asyncHandler(async (req, res, next) => {

    const { name, email, username, password } = req.body;

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (user) {
        if (user.username === username) {
            return next(new ErrorHandler("Username already exists", 401));
        }
        return next(new ErrorHandler("Email already exists", 401));
    }

    // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: "Avatars",
    //     width: 150,
    //     crop: "scale"
    // })

    const newUser = await User.create({
        name,
        email,
        username,
        password,
        avatar: {
            public_id: "myCloud.public_id",
            url: "myCloud.secure_url"
        }
    })

    sendCookie(newUser, 201, res);
});

// Login User
const loginUser = asyncHandler(async (req, res, next) => {

    const { userId, password } = req.body;

    const user = await User.findOne({
        $or: [{ email: userId }, { username: userId }]
    }).select("+password");

    if (!user) {
        return next(new ErrorHandler("User doesn't exist", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Password doesn't match", 401));
    }

    sendCookie(user, 201, res);
});

// Logout User
const logoutUser = asyncHandler(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Get User Details --Logged In User
const getAccountDetails = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id)

    res.status(200).json({
        success: true,
        user,
    });
});

// Get User Details By Id
const getUserDetailsById = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    res.status(200).json({
        success: true,
        user,
    });
});

// Update Password
const updatePassword = asyncHandler(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const isPasswordMatched = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Old Password", 401));
    }

    user.password = newPassword;
    await user.save();
    sendCookie(user, 201, res);
});

// Update Profile
const updateProfile = asyncHandler(async (req, res, next) => {

    const { name, username, website, bio, email } = req.body;

    const newUserData = {
        name,
        username,
        website,
        bio,
        email,
    }

    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });
    if (userExists && userExists._id.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("User Already Exists", 404));
    }

    // if (req.body.avatar !== "") {
    //     const user = await User.findById(req.user.id)

    //     const imageId = user.avatar.public_id

    //     await cloudinary.v2.uploader.destroy(imageId)

    //     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //         folder: "avatars",
    //         width: 150,
    //         crop: 'scale'
    //     })

    //     newUserData.avatar = {
    //         public_id: myCloud.public_id,
    //         url: myCloud.secure_url
    //     }
    // }

    await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    });

    res.status(200).json({
        success: true,
    });
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    const resetPasswordToken = await user.getResetPasswordToken()

    await user.save();

    const resetPasswordUrl = `https://${req.get("host")}/password/reset/${resetPasswordToken}`;

    try {
        await sendMail({
            email: user.email,
            subject: "Reset password link for Instagram Clone",
            message: resetPasswordUrl
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendCookie(user, 200, res);
});

module.exports = {
    signupUser, loginUser, logoutUser, getAccountDetails, getUserDetailsById, updatePassword, updateProfile, forgotPassword, resetPassword
}