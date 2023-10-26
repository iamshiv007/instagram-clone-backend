const { loginUser, signupUser, logoutUser, getUserDetailsById, forgotPassword, resetPassword, updatePassword, updateProfile, getAccountDetails } = require("../controllers/user")
const { isAuthenticated } = require("../middlewares/auth")

const router = require("express").Router()

router.post("/login", loginUser)
router.post("/register", signupUser)
router.get("/logout", logoutUser)
router.get("/me", isAuthenticated, getAccountDetails)
router.get("/detailsById/:id", isAuthenticated, getUserDetailsById)
router.put("/update/profile", isAuthenticated, updateProfile)
router.put("/password/update", isAuthenticated, updatePassword)

router.post("/password/forgot", forgotPassword)
router.put("/password/reset/:token", resetPassword)

module.exports = router