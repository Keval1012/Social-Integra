import express from 'express';
import { handleSharePost, handleSharePagePost, getFbPageAccessToken, shareOnInstagram, getLongAccessToken, authLinkedin, shareLinkedinPost, mediaTweet, getTwitterRequestToken, getTwitterOAuthByAuth, verifyAndGetAccessTokenTwitter, getFbAllPostSubDetailsByPageId, getFbPostDetailsByPostId, getFbPageReachByPageId, getFbPageDetails, getInstagramAccountId, getUserDetailsInstagram, getAllPostsDetailsInstagramByUserId, getInstagramPageInsights, getTwitterUserInfo } from '../controllers/posts.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// router.route('/')
// .post(getUserLogin);

// router.route('/changePassword')
// .post(changePassword)

// router.route('/share-post')
// .post(upload.array('post'), handleSharePost);

router.route('/share-page-post')
.post(upload.array('post'), handleSharePagePost);

router.route('/fb-page-accessToken')
.post(getFbPageAccessToken);

router.route('/share-on-instagram')
.post(shareOnInstagram);

router.route('/getLongAccessToken')
.post(getLongAccessToken);

router.route('/authLinkedin')
.post(authLinkedin);

router.route('/shareLinkedinPost')
.post(upload.single('image'), shareLinkedinPost);

router.route('/getTwitterOAuthByAuth')
.post(getTwitterOAuthByAuth);

router.route('/verifyAndGetAccessTokenTwitter')
.post(verifyAndGetAccessTokenTwitter);

// router.route('/getTwitterRequestToken')
// .post(getTwitterRequestToken);

router.route('/mediaTweet')
.post(upload.single('image'), mediaTweet);



// ----------- Facebook -------------------

router.route('/getFbPageDetails')
.post(getFbPageDetails);

router.route('/getFbAllPostSubDetailsByPageId')
.post(getFbAllPostSubDetailsByPageId);

router.route('/getFbPostDetailsByPostId')
.post(getFbPostDetailsByPostId);

router.route('/getFbPageReachByPageId')
.post(getFbPageReachByPageId);



// ----------- Instagram -------------------

router.route('/getInstagramAccountId')
.post(getInstagramAccountId);

router.route('/getUserDetailsInstagram')
.post(getUserDetailsInstagram);

router.route('/getAllPostsDetailsInstagramByUserId')
.post(getAllPostsDetailsInstagramByUserId);

router.route('/getInstagramPageInsights')
.post(getInstagramPageInsights);



// ----------- Twitter -------------------

router.route('/getTwitterUserInfo')
.post(getTwitterUserInfo);

export default router;