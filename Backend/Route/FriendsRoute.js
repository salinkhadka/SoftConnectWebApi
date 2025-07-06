const express = require('express');
const router = express.Router();
const FollowController = require('../Controller/FriendsController');

router.post('/follow', FollowController.followUser);
router.post('/unfollow', FollowController.unfollowUser);
router.get('/followers/:userId', FollowController.getFollowers);
router.get('/following/:userId', FollowController.getFollowing);

module.exports = router;
