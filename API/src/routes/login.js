import express from 'express';
import { handleAuthCallback, handleGetUserInfo } from '../controllers/login.js';

const router = express.Router();

// router.route('/')
// .post(getUserLogin);

// router.route('/changePassword')
// .post(changePassword)


// router.route('/auth/google', googleAuth);

router.route('/getUser')
.get(handleGetUserInfo);

// Callback route after Google authentication
// router.route('/auth/google/callback', googleAuthCallback);
// router.route('/auth/google/callback', handleAuthCallback);

export default router;