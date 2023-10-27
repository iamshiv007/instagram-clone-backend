const { loginUser, signupUser, logoutUser, getUserDetailsById, forgotPassword, resetPassword, updatePassword, updateProfile, getAccountDetails, getUserDetails, getAllUsers, deleteProfile, searchUsers, followUser } = require("../controllers/user")
const { isAuthenticated } = require("../middlewares/auth")

const router = require("express").Router()

// Authentication-related routes
router.post("/login", loginUser)
router.post("/register", signupUser)
router.get("/logout", logoutUser)

// User profile and account management
router.route("/me")
    .get(isAuthenticated, getAccountDetails)
    .delete(isAuthenticated, deleteProfile)

router.put("/update/profile", isAuthenticated, updateProfile)
router.put("/password/update", isAuthenticated, updatePassword)

// User details and interactions
router.get("/details/id/:id", isAuthenticated, getUserDetailsById)
router.get("/details/userName/:userName", getUserDetails)
router.get("/suggested", isAuthenticated, getAllUsers)
router.get("/follow/:id", isAuthenticated, followUser)
router.get("/search", isAuthenticated, searchUsers)

// Password reset functionality
router.post("/password/forgot", forgotPassword)
router.put("/password/reset/:token", resetPassword)

module.exports = router