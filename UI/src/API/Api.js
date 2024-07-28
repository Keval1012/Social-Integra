import { message } from "antd";
import axios from "axios";
import { API_HOST } from "../constants";

const baseUrl = `${API_HOST}/api`;

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');
        if (token) {
            config.headers = {
                token: token,
                // "Content-Type": `multipart/form-data`
            }
        }
        return config;
    },
    (error) => {
        if (error.response && error.response.status === 400) {
            return axiosInstance.request(error.config);
        }
        return error.response ? error.response : Promise.reject(new Error(error));
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error?.response?.status === 400 || error?.response?.status === 403 || error?.response?.status === 404 || error?.response?.status === 409 || error?.response?.status === 500) {
            // try {
            //   await addException({ 
            //     exception: error?.response?.data?.message,
            //     stackTrace: `at - "${error?.config?.url}" - (${error?.config?.method})`,
            //     errorCode: `${error?.response?.status}`,
            //     innerException: error?.response?.data?.error ? error?.response?.data?.error : error?.response?.data?.message
            //   });
            //   return;
            // } catch (error) {
            //   return message.error('Error in Add Exception' + error);
            // }
        }
        if (error?.response?.data?.isAuth === false) {
            localStorage.clear();

            // await showSessionExpiredMessage();
            // message.error('Session Expired - Please Login Again.');
            // setTimeout(() => {
            //   window.location.href = '/login';
            // }, 1000);
        }
        // if (error.response && error.response.status === 401) {
        //     return axiosInstance.request(error.config);
        // }
        return error.response ? error.response : Promise.reject(new Error(error));
    }
);

export const getUserLogin = async (data) => {
    return await axiosInstance.post(`${baseUrl}/login`, data);
};

export const getUserGoogleLoginInfo = async () => {
    return await axiosInstance.get(`${baseUrl}/login/getUser`);
};


// ------------------------- Posts ---------------------------------

export const getLongAccessToken = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getLongAccessToken`, data);
};

export const sharePost = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/share-post`, data);
};

export const sharePagePost = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/share-page-post`, data);
};

export const getFbPageAccessToken = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/fb-page-accessToken`, data);
};

export const getFbPageDetails = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getFbPageDetails`, data);
};

export const getFbAllPostSubDetailsByPageId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getFbAllPostSubDetailsByPageId`, data);
};

export const getFbPostDetailsByPostId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getFbPostDetailsByPostId`, data);
};

export const getFbPageReachByPageId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getFbPageReachByPageId`, data);
};

export const getFbPostInsightByPostId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getFbPostInsightByPostId`, data);
};

// ------------------- Instagram ------------------------

export const getUserDetailsInstagram = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getUserDetailsInstagram`, data);
};

export const getAllCommentsByInstagramPostId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getAllCommentsByInstagramPostId`, data);
};

export const getCommentDetailsByInstagramCommentId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getCommentDetailsByInstagramCommentId`, data);
};

export const getAllPostsDetailsInstagramByUserId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getAllPostsDetailsInstagramByUserId`, data);
};

export const getPostDetailsInstagramByPostId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getPostDetailsInstagramByPostId`, data);
};

export const getInstagramAccountId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getInstagramAccountId`, data);
};

export const getInstagramPageInsights = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getInstagramPageInsights`, data);
};

export const getInstagramPostInsightsByPostId = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getInstagramPostInsightsByPostId`, data);
};

export const getIGPageAccessAndPost = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/share-on-instagram`, data);
};

// -------------- Linked In -------------------------

export const authLinkedin = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/authLinkedin`, data);
};

export const getLinkedinUserInfo = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getLinkedinUserInfo`, data);
};

export const shareLinkedinPost = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/shareLinkedinPost`, data);
};

// -------------- Twitter -------------------------

export const getTwitterOAuthByAuth = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getTwitterOAuthByAuth`, data);
};

export const verifyAndGetAccessTokenTwitter = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/verifyAndGetAccessTokenTwitter`, data);
};

export const getTwitterRequestToken = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getTwitterRequestToken`, data);
};

export const getTwitterUserInfo = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/getTwitterUserInfo`, data);
};

export const shareTwitterPost = async (data) => {
    return await axiosInstance.post(`${baseUrl}/posts/mediaTweet`, data);
};