const Post = require('../models/post');
const User = require('../models/user');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
// const cloudinary = require("cloudinary")

// Create New Post
const newPost = asyncHandler(async (req, res, next) => {
    const myCloud = cloudinary.v2.uploader.upload(req.body.post, {
        folder: "posts",
        width: 150,
        crop: "scale",
        q_auto: true
    })

    const postData = {
        caption: req.body.caption,
        image: {
            public_id: "myCloud.public_id",
            url: "myCloud.secure_url"
        },
        postedBy: req.user._id
    }

    const post = await Post.create(postData);

    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save();

    res.status(201).json({
        success: true,
        post,
    });
});

// Like or Unlike Post
const likeUnlikePost = asyncHandler(async (req, res, next) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorHandler("Post Not Found", 404));
    }

    if (post.likes.includes(req.user._id)) {
        const index = post.likes.indexOf(req.user._id);

        post.likes.splice(index, 1);
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Unliked"
        });
    } else {
        post.likes.push(req.user._id)

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Liked"
        });
    }
});

// Delete Post
const deletePost = asyncHandler(async (req, res, next) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorHandler("Post Not Found", 404));
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Unauthorized", 401));
    }

    // await cloudinary.v2.uploader.destroy(product.image.public_id)

    await post.remove();

    const user = await User.findById(req.user._id);

    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);
    await user.save();

    res.status(200).json({
        success: true,
        message: "Post Deleted"
    });
});

// Update Caption
const updateCaption = asyncHandler(async (req, res, next) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorHandler("Post Not Found", 404));
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Unauthorized", 401));
    }

    post.caption = req.body.caption;

    await post.save();

    res.status(200).json({
        success: true,
        message: "Post Updated"
    });
});

// Add Comment
const newComment = asyncHandler(async (req, res, next) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorHandler("Post Not Found", 404));
    }

    if (post.comments.includes(req.user._id)) {
        return next(new ErrorHandler("Already Commented", 500));
    }

    post.comments.push({
        user: req.user._id,
        comment: req.body.comment
    });

    await post.save();

    return res.status(200).json({
        success: true,
        message: "Comment Added"
    });
});

// Posts of Following
const getPostsOfFollowing = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id)

    const currentPage = Number(req.query.page) || 1;

    const skipPosts = 4 * (currentPage - 1);

    const totalPosts = await Post.find({
        postedBy: {
            $in: user.following
        }
    }).countDocuments();

    const posts = await Post.find({
        postedBy: {
            $in: user.following
        }
    }).populate("postedBy likes").populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    }).sort({ createdAt: -1 }).limit(4).skip(skipPosts)

    return res.status(200).json({
        success: true,
        posts: posts,
        totalPosts
    });
});

// Save or Unsave Post
const saveUnsavePost = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id)

    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new ErrorHandler("Post Not Found", 404));
    }

    if (user.saved.includes(post._id.toString())) {
        user.saved = user.saved.filter((p) => p.toString() !== post._id.toString())
        post.savedBy = post.savedBy.filter((p) => p.toString() !== req.user._id.toString())
        await user.save();
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Unsaved"
        });
    } else {
        user.saved.push(post._id)
        post.savedBy.push(req.user._id)

        await user.save();
        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Saved"
        });
    }
});

// Get Post Details
const getPostDetails = asyncHandler(async (req, res, next) => {

    const post = await Post.findById(req.params.id).populate("postedBy likes").populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });

    if (!post) {
        return next(new ErrorHandler("Post Not Found", 404));
    }

    res.status(200).json({
        success: true,
        post,
    });
});

// Get All Posts
const allPosts = asyncHandler(async (req, res, next) => {

    const posts = await Post.find();

    return res.status(200).json({
        posts
    });
});

module.exports = { newPost, likeUnlikePost, deletePost, updateCaption, newComment, getPostsOfFollowing, saveUnsavePost, getPostDetails, allPosts }