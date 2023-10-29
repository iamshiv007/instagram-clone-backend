const { newPost, deletePost, likeUnlikePost, newComment, updateCaption, getPostsOfFollowing, saveUnsavePost, allPosts, getPostDetails } = require("../controllers/post")
const { isAuthenticated } = require("../middlewares/auth")

const router = require("express").Router()

router.post("/new", isAuthenticated, newPost)
router.post("/comment/:id", isAuthenticated, newComment)

router.get("/following", isAuthenticated, getPostsOfFollowing)
router.get("/all", allPosts)

router.get("/details/:id", isAuthenticated, getPostDetails)
router.get("/save/:id", isAuthenticated, saveUnsavePost)
router.get("/like/:id", isAuthenticated, likeUnlikePost)

router.route("/:id")
    .put(isAuthenticated, updateCaption)
    .delete(isAuthenticated, deletePost);

module.exports = router;