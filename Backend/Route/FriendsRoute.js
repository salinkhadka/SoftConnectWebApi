const express = require('express');
const router = express.Router();
const FollowController = require('../Controller/FriendsController');
const { authenticateUser } = require("../Middleware/AuthMiddleware");

router.post('/follow', authenticateUser, FollowController.followUser);
router.post('/unfollow', authenticateUser, FollowController.unfollowUser);
router.get('/followers/:userId', FollowController.getFollowers);
router.get('/following/:userId', FollowController.getFollowing);


module.exports = router;
