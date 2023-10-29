const { loginUser, signupUser, logoutUser, getUserDetailsById, forgotPassword, resetPassword, updatePassword, updateProfile, getAccountDetails, getUserDetails, getAllUsers, deleteProfile, searchUsers, followUser } = require("../controllers/user")
const { isAuthenticated } = require("../middlewares/auth")

const router = require("express").Router()

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)

router.route("/me")
    .get(isAuthenticated, getAccountDetails)
    .delete(isAuthenticated, deleteProfile)

router.put("/update/profile", isAuthenticated, updateProfile)
router.put("/password/update", isAuthenticated, updatePassword)

router.get("/details/id/:id", isAuthenticated, getUserDetailsById)
router.get("/details/userName/:userName", getUserDetails)
router.get("/suggested", isAuthenticated, getAllUsers)
router.get("/follow/:id", isAuthenticated, followUser)
router.get("/search", isAuthenticated, searchUsers)

router.post("/password/forgot", forgotPassword)
router.put("/password/reset/:token", resetPassword)

module.exports = router