import { authLinkedinService, getAllPostsDetailsInstagramByUserIdService, getFbAllPostSubDetailsByPageIdService, getFbPageAccessTokenService, getFbPageDetailsService, getFbPageReachByPageIdService, getInstagramAccountIdService, getInstagramPageInsightsService, getLongAccessTokenService, getTwitterOAuthByAuthService, getTwitterRequestTokenService, getTwitterUserInfoService, getUserDetailsInstagramService, mediaTweetService, shareLinkedinPostService, shareOnInstagramService, sharePostService, sharePostToFbPageService, verifyAndGetAccessTokenTwitterService } from "../services/posts.js";


export const handleSharePost = async (req, res) => {
    try {
        const result = await sharePostService(req, res);
        return res.status(result.status).send({ success: true, data: result });

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getLongAccessToken = async (req, res) => {
    // debugger
    try {
        const result = await getLongAccessTokenService(req, res);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const handleSharePagePost = async (req, res) => {
    try {
        const result = await sharePostToFbPageService(req, res);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getFbPageAccessToken = async (req, res) => {
    try {
        const result = await getFbPageAccessTokenService(req, res);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const shareOnInstagram = async (req, res) => {
    try {
        const result = await shareOnInstagramService(req, res);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const authLinkedin = async (req, res) => {
    try {
        const result = await authLinkedinService(req, res);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const shareLinkedinPost = async (req, res) => {
    try {
        const result = await shareLinkedinPostService(req, res);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

// --------------------- Twitter ---------------------------

export const getTwitterOAuthByAuth = async (req, res) => {
    try {
        const result = await getTwitterOAuthByAuthService(req, res);
        return res.status(result.status).send(result.data);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const verifyAndGetAccessTokenTwitter = async (req, res) => {
    try {
        const result = await verifyAndGetAccessTokenTwitterService(req, res);
        return res.status(result.status).send(result.data);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getTwitterRequestToken = async (req, res) => {
    try {
        const result = await getTwitterRequestTokenService(req, res);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const mediaTweet = async (req, res) => {
    try {
        const result = await mediaTweetService(req, res);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};



// --------------------- Facebook ---------------------------

export const getFbPageDetails = async (req, res) => {
    try {
        const result = await getFbPageDetailsService(req, res);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getFbAllPostSubDetailsByPageId = async (req, res) => {
    try {
        const result = await getFbAllPostSubDetailsByPageIdService(req, res);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getFbPostDetailsByPostId = async (req, res) => {
    try {
        const result = await getFbAllPostSubDetailsByPageIdService(req, res);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getFbPageReachByPageId = async (req, res) => {
    try {
        const result = await getFbPageReachByPageIdService(req, res);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};



// --------------------- Instagram ---------------------------

export const getInstagramAccountId = async (req, res) => {
    try {
        const result = await getInstagramAccountIdService(req, res);
        return res.status(result.status).send(result.data);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getUserDetailsInstagram = async (req, res) => {
    try {
        const result = await getUserDetailsInstagramService(req, res);
        return res.status(result.status).send(result.data);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getAllPostsDetailsInstagramByUserId = async (req, res) => {
    try {
        const result = await getAllPostsDetailsInstagramByUserIdService(req, res);
        return res.status(result.status).send(result.data);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const getInstagramPageInsights = async (req, res) => {
    try {
        const result = await getInstagramPageInsightsService(req, res);
        return res.status(result.status).send(result.data);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};



// --------------------- Twitter ---------------------------

export const getTwitterUserInfo = async (req, res) => {
    try {
        const result = await getTwitterUserInfoService(req, res);
        return res.status(result.status).send(result);
    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};