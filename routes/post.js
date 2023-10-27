const { newPost, deletePost, likeUnlikePost, newComment, updateCaption, getPostsOfFollowing, saveUnsavePost, allPosts, getPostDetails } = require("../controllers/post")
const { isAuthenticated } = require("../middlewares/auth")

const router = require("express").Router()

// Post creation and comments
router.post("/new", isAuthenticated, newPost)
router.post("/comment/:id", isAuthenticated, newComment)

// Post retrieval and interaction
router.get("/following/posts", isAuthenticated, getPostsOfFollowing)
router.get("/all", allPosts)

// Individual post details, saving, liking/unliking
router.get("/details/:id", isAuthenticated, getPostDetails)
router.get("/save/:id", isAuthenticated, saveUnsavePost)
router.get("/like/:id", isAuthenticated, likeUnlikePost)

// Update and delete post
router.route("/:id")
    .put(isAuthenticated, updateCaption)
    .delete(isAuthenticated, deletePost);

module.exports = router;