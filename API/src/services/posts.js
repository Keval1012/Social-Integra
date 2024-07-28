import { downloadImage, fileToBlobUrl } from "../helper.js";
// import fb from 'fb';
import fs from 'fs';
import axios from 'axios';
import FormData from "form-data";
import graph from 'fbgraph';
import { TwitterApi } from 'twitter-api-v2';
import Oauth from 'oauth-1.0a';
import crypto from 'crypto';
import { OAuth } from 'oauth';
import request from "request";
// import FB from 'fb';

// FB.setAccessToken('access_token');

async function downloadImage1(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
    }
};

async function uploadImageToFacebook(imageData) {
    try {
        debugger
        const formData = new FormData();
        formData.append('access_token', 'EAAFBDj9SHHMBOzZB94pYIiAfyKRZCCJieWpYrLZBXQZA8HB5Mva6TqfaEBZAIIGOw4pkdDQlWfJuB8Ekgq2WOYtoMJ6bxaF0P0cxE5zIV8ZBtYwEhr6SsNKb7kB1a6hVAVILtr4GSL7y0u4wFX5F2BdxJUNxzbp0Y9wofQ4WJV77Drn0zug9NZBgDLUvFZAgT7tO1W771P8Qw4ZCpJ9fVwnco6wyl6XW8fk3tXjAZD');
        // formData.append('source', fs.createReadStream(imageData));
        formData.append('source', imageData, { filename: 'image.jpg' });

        const response = await axios.post(
            'https://graph.facebook.com/v13.0/me/photos',
            formData,
            {
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    ...formData.getHeaders(),
                }
            }
        );

        return response.data.id;
    } catch (error) {
        console.error('Error uploading image to Facebook:', error);
        throw error;
    }
};

export const sharePostService = async (req, res) => {
    try {
        const { post, postContent, postAccountList } = req.body;
        debugger
        if (!post || !postContent || postAccountList?.length === 0) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING' };

        // fb.options({
        //     appId: '353004424404083',
        //     appSecret: '1f81ea8955fd1e637b4f23e85a9919e6',
        //     accessToken: 'EAAFBDj9SHHMBOZCpvsGZA7HTWF0kVKOQYDyJD9fKncrNuTtabwyleU4bZAbmnABWzQ3l2oGbBqdukYjasjkHYLY3PxEn4irADZA6hs45NMdjGIucNGnHr0IAeCCs0AmLcAuxJ3mtXmWWDIWmA3fiTfPF2gNkekDrNkLwGmpHo15F0ekZC4twQgLhOd5mZBAmo9G6fk0dB9gIKUSk1KJCkn0jRgQ8UdD6HvppUiCiyLBN71o0r7QUo2lfJQzSL7ZA42sDYs20gZDZD'
        // });

        const appId = '353004424404083';
        const appSecret = '1f81ea8955fd1e637b4f23e85a9919e6';

        const client = new graph.FacebookClient({
            appId,
            appSecret,
        });

        const res = await client.get('/me/accounts');

        client.get('/me/accounts', (err, accounts) => {
            if (err) {
                debugger
                console.log(err);
                return;
            }
            // Do something with the accounts.
        });

        let bodyImage, b = null;
        let imageUrl = 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';


        if (typeof post === 'string') {
            bodyImage = JSON.parse(post)
        } else {
            bodyImage = post;
        }

        let obj = {
            lastModified: bodyImage.lastModified,
            lastModifiedDate: bodyImage.lastModifiedDate,
            name: bodyImage.name,
            size: bodyImage.size,
            type: bodyImage.type
        }

        // const temp = await fileToBlobUrl(obj);

        // fileToBlobUrl(obj)
        //     .then(({ blobUrl, blob }) => {
        //         debugger
        //         console.log('Blob URL:', blobUrl);
        //         console.log('Blob:', blob);
        //         b = blob;
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //     });

        // const photoResponse = await fb.api('me/photos', 'post', { source: imageUrl });
        // const postData = {
        //     message: message,
        //     attached_media: [{ media_fbid: photoResponse.id }]
        // };
        // const response = await fb.api('me/feed', 'post', postData);
        // console.log('Post shared with image:', response);

        const response2 = await axios.post(
            `https://graph.facebook.com/me/feed`,
            {
                message: "Testingg Content",
                access_token: 'EAAFBDj9SHHMBO6wPMhsTGOluOvJlGqV3Qcwux2Iqz7UjhqW4SliA5yct02syWEceOHhlwWbCNZBozBcy2s9l83pvdZBWOc9XaNhPRgJ7fOwLA7AlR7ekdfkI9ZBGHSkGiM30VYKjy5dge6ZCwB5JGKilDMxZCJAvKMXqGYbrrvmPPiBhqLp2ZCQlrs3UeWvNqElf1GW22j2ZAsX7yPMz9fD2zUbOOZCd86PMRe4Y'
            }
        );

        const response1 = await axios.post(
            'https://graph.facebook.com/v13.0/me/feed',
            {
                message: 'Check out this awesome content!',
                // link: 'https://example.com' // URL to share
            },
            {
                params: {
                    access_token: 'EAAFBDj9SHHMBO6wPMhsTGOluOvJlGqV3Qcwux2Iqz7UjhqW4SliA5yct02syWEceOHhlwWbCNZBozBcy2s9l83pvdZBWOc9XaNhPRgJ7fOwLA7AlR7ekdfkI9ZBGHSkGiM30VYKjy5dge6ZCwB5JGKilDMxZCJAvKMXqGYbrrvmPPiBhqLp2ZCQlrs3UeWvNqElf1GW22j2ZAsX7yPMz9fD2zUbOOZCd86PMRe4Y'
                }
            }
        );

        const imgD = await downloadImage(imageUrl);
        const imgRes = await uploadImageToFacebook(imgD);
        const postData = {
            message: message,
            attached_media: [{ media_fbid: imgRes }]
        };
        const response = await axios.post(
            'https://graph.facebook.com/v13.0/me/feed',
            postData,
            {
                params: {
                    access_token: 'EAAFBDj9SHHMBO6wPMhsTGOluOvJlGqV3Qcwux2Iqz7UjhqW4SliA5yct02syWEceOHhlwWbCNZBozBcy2s9l83pvdZBWOc9XaNhPRgJ7fOwLA7AlR7ekdfkI9ZBGHSkGiM30VYKjy5dge6ZCwB5JGKilDMxZCJAvKMXqGYbrrvmPPiBhqLp2ZCQlrs3UeWvNqElf1GW22j2ZAsX7yPMz9fD2zUbOOZCd86PMRe4Y'
                }
            }
        );
        console.log('Post shared with image:', response.data);

        return { success: true, status: 200, message: 'Successfully Posted.' };

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong', error: error };
    }
};

export const getLongAccessTokenService = async (req, res) => {
    try {
        const { userId, accessToken, appSecret } = req.body;
        if (!userId || !accessToken || !appSecret) return { status: 400, success: false, message: 'Missing Fields!' };
        const { data } = await axios.get(`https://graph.facebook.com/oauth/access_token?client_id=${userId}&client_secret=${appSecret}&grant_type=fb_exchange_token&fb_exchange_token=${accessToken}`);

        return { success: true, status: 200, data: data };
    } catch (error) {
        return { status: 500, success: false, message: 'Something went wrong' };
    }
};

export const sharePostToFbPageService = async (req, res) => {
    try {
        const { content, url, pageId, pageAccessToken } = req.body;
        debugger
        if (!content || !url || !pageId || !pageAccessToken) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING' }

        const response = await axios.post(
            `https://graph.facebook.com/${pageId}/photos`,
            {
                message: content,
                url: url,
                // url: 'http://localhost:4002/images/pet1.jpeg',
                // access_token: process.env.FB_PAGE_ACCESS_TOKEN
                access_token: pageAccessToken
            }
        );

        return { data: response, success: true, status: 200 };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getFbPageAccessTokenService = async (req, res) => {
    try {
        const { accessToken, longAccessToken, userId, appSecret } = req.body;

        if (!accessToken || !longAccessToken || !userId || !appSecret) return { success: false, status: 400, message: 'REQUIRED_FIELDS_MISSING' };

        // const dataShort = await axios.get(`https://www.facebook.com/dialog/oauth?client_id=MY_CLIENT_ID&redirect_uri=MY_SITE_URL&scope=manage_pages&response_type=token`);

        // debugger
        // const creds = await axios.post('https://graph.facebook.com/oauth/access_token', {
        //     grant_type: 'client_credentials',
        //     client_id: userId,
        //     client_secret: appSecret,
        //     permissions: 'manage_pages,public_profile,pages_manage_ads,pages_manage_metadata,pages_manage_posts,pages_manage_cta,manage_pages',
        // });

        // const { data } = await axios.get(
        //     // `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${userId}&client_secret=${appSecret}&fb_exchange_token=${accessToken}`
        //     // `https://graph.facebook.com/oauth/access_token?client_id=${userId}&client_secret=${appSecret}&grant_type=fb_exchange_token&fb_exchange_token=${accessToken}`
        //     `https://graph.facebook.com/oauth/access_token?client_id=${userId}&client_secret=${appSecret}&grant_type=fb_exchange_token&fb_exchange_token=${accessToken}`
        // );

        const getAccId = await axios.get(
            // `https://graph.facebook.com/v19.0/me?access_token=${data.access_token}`
            `https://graph.facebook.com/v19.0/me?access_token=${longAccessToken}`
        );

        const getPageAccess = await axios.get(
            // `https://graph.facebook.com/v19.0/${getAccId.data.id}/accounts?access_token=${data.access_token}`
            `https://graph.facebook.com/v19.0/${getAccId.data.id}/accounts?access_token=${longAccessToken}`
        );

        // const { data1 } = await axios.get(
        //   `https://graph.facebook.com/v19.0/${userId}/accounts?access_token=${data.access_token}`
        // );

        // const pageAccessToken = data.data[0].access_token;
        return { success: true, status: 200, data: getPageAccess.data };
    } catch (error) {
        return { status: 500, success: false, message: 'Failed to fetch page access token' };
    }
};

export const shareOnInstagramService = async (req, res) => {
    try {
        const { content, url, userId, appSecret, accessToken, longAccessToken } = req.body;

        if (!content || !url || !userId || !appSecret || !longAccessToken) return { status: 400, success: false, message: "Missing fields!" };
        debugger

        // const { long_access } = await axios.get(`https://graph.facebook.com/oauth/access_token?client_id=${userId}&client_secret=${appSecret}&grant_type=fb_exchange_token&fb_exchange_token=${accessToken}`);

        const getAccId = await axios.get(`https://graph.facebook.com/v19.0/me?access_token=${longAccessToken}`);
        const getPageId = await axios.get(`https://graph.facebook.com/v19.0/${getAccId.data.id}/accounts?access_token=${longAccessToken}`);

        const data = await axios.get(`https://graph.facebook.com/v19.0/${getPageId.data.data[0].id}?fields=instagram_business_account&access_token=${longAccessToken}`);

        const data2 = await axios.post(`https://graph.facebook.com/v19.0/${data?.data?.instagram_business_account?.id}/media?image_url=${url}&caption=${content}&access_token=${longAccessToken}`);

        const response = await axios.post(`https://graph.facebook.com/v19.0/${data?.data?.instagram_business_account?.id}/media_publish?creation_id=${data2.data.id}&access_token=${longAccessToken}`);

        return { success: true, status: 200, data: response };
    } catch (error) {
        return { status: 500, success: false, message: 'Failed to post on IG!' };
    }
};

export const authLinkedinService = async (req, res) => {
    try {
        const { grantType, clientSecret, clientId, code, redirectUrl } = req.body;

        if (!grantType || !clientSecret || !clientId || !code || !redirectUrl) return { success: false, status: 400, message: 'Missing Fields!' };
        debugger

        const { data } = await axios.post(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=${grantType}&code=${code}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUrl}`);

        // const { data } = await axios.post(`https://www.linkedin.com/oauth/v2/accessToken`,
        //     {
        //         grant_type: grantType,
        //         code: code,
        //         client_secret: clientSecret,
        //         client_id: clientId,
        //         redirect_uri: redirectUrl
        //     },
        //     {
        //         headers: {
        //             // 'Content-Type': 'x-www-form-urlencoded',
        //             'Content-Type': 'application/x-www-form-urlencoded',
        //             // "Access-Control-Allow-Headers" : "Content-Type",
        //             // "Access-Control-Allow-Origin": "*",
        //             // 'Access-Control-Allow-Credentials': true
        //             // 'Content-Type': 'application/json',
        //             // "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH"
        //         }
        //     });

        return { success: true, status: 200, data: data };

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong!' };
    }
};

export const shareLinkedinPostService = async (req, res) => {
    try {
        const { image, accessToken, url, description } = req.body;

        debugger
        if (!accessToken || !url || !description) return { success: false, status: 400, message: 'Missing Fields!' };

        // const userInfo = await axios.get('https://api.linkedin.com/v2/userinfo', {
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`,
        //         'Connection': 'Keep-Alive',
        //         'X-Restli-Protocol-Version': '2.0.0',
        //     },
        // });

        // const response = await axios.post(`https://api.linkedin.com/v2/shares`, {
        //     owner: `urn:li:person:${userInfo.data.sub}`,
        //     text: {
        //         text: description,
        //     },
        //     content: {
        //         contentEntities: [
        //             {
        //                 entityLocation: url 
        //             }
        //         ]
        //     },
        //     distribution: {
        //         linkedInDistributionTarget: {},
        //     },
        // }, {
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`,
        //         'Content-Type': 'application/json',
        //         'X-Restli-Protocol-Version': '2.0.0', // LinkedIn API version
        //     },
        // });

        return { success: true, status: 200, data: response.data };

    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong!' };
    }
};

// -------------------------------- Twitter Api's ---------------------------


async function getTwitterRequestAuth(consumerKey, consumerSecret, callbackUrl) {
    // request.post({
    //     url: 'https://api.twitter.com/oauth/request_token',
    //     oauth: {
    //         // oauth_callback: "https://127.0.0.1:3000/settings",
    //         oauth_callback: callbackUrl,
    //         consumer_key: consumerKey,
    //         consumer_secret: consumerSecret
    //     }
    // }, function (err, r, body) {
    //     debugger
    //     if (err) {
    //         // return res.send(500, { message: e.message });
    //         return { error: e.message };
    //     }

    //     let jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    //     // res.send(JSON.parse(jsonStr));
    //     return JSON.parse(jsonStr);
    // });

    try {
        const response = await new Promise((resolve, reject) => {
            request({
                    url: 'https://api.twitter.com/oauth/request_token',
                    oauth: {
                        // oauth_callback: "https://127.0.0.1:3000/settings",
                        oauth_callback: callbackUrl,
                        consumer_key: consumerKey,
                        consumer_secret: consumerSecret
                    }
                }, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    let jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
                    resolve(JSON.parse(jsonStr));
                }
            });
        });
    
        // debugger
        console.log(response);
        return response;
    } catch (error) {
        return error;
    }


};

export const getTwitterOAuthByAuthService = async (req, res) => {
    try {
        const { consumerKey, consumerSecret, callbackUrl } = req.body;

        debugger

        // const re2 = await axios.post('', null, {
        //     headers: {
                
        //     }
        // })

        const re1 = await getTwitterRequestAuth(consumerKey, consumerSecret, callbackUrl);

        // const re = await request.post({
        //     url: 'https://api.twitter.com/oauth/request_token',
        //     oauth: {
        //         // oauth_callback: "https%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        //         // oauth_callback: "https%3A%2F%2Flocalhost%3A3000%2Fsettings",
        //         // oauth_callback: "https%3A%2F%2F127.0.0.1%3A3000%2Fsettings",
        //         oauth_callback: "https://127.0.0.1:3000/settings",
        //         // oauth_callback: "https://localhost:3000/settings",
        //         consumer_key: consumerKey,
        //         consumer_secret: consumerSecret
        //     }
        // }, function (err, r, body) {
        //     debugger
        //     if (err) {
        //         return res.send(500, { message: e.message });
        //     }

        //     let jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        //     res.send(JSON.parse(jsonStr));
        // });


        // const _oauth = new (OAuth)(
        //     'https://api.twitter.com/oauth/request_token',
        //     // 'https://api.twitter.com/oauth/access_token',
        //     consumerKey,
        //     consumerSecret,
        //     '1.0',
        //     'https://127.0.0.1:3000/settings',
        //     'HMAC-SHA1'
        // );

        // const res = await _oauth.getOAuthRequestToken();

        // return new Promise((resolve, reject) => {
        //   _oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
        //     if(error) {
        //       reject(error);  
        //     } else {
        //       resolve({oauth_token, oauth_token_secret, results});  
        //     }
        //   });
        // });
        return { success: true, status: 200, data: re1 };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

async function requestToken(consumerKey, consumerSecret, callbackUrl) {
    try {
        debugger
        const oauth = Oauth({
            consumer: {
                key: consumerKey,
                secret: consumerSecret
            },
            signature_method: 'HMAC-SHA1',
            hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
        });

        // const requestTokenURL = `https://api.twitter.com/oauth/request_token?oauth_callback=${callbackUrl}&x_auth_access_type=write`;
        // const requestTokenURL = `https://api.twitter.com/oauth/request_token?oauth_callback=https://google.com&x_auth_access_type=write`;
        const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
        const authHeader = oauth.toHeader(oauth.authorize({
            url: requestTokenURL,
            method: 'POST'
        }));

        const request = await fetch(requestTokenURL, {
            'method': 'POST',
            headers: {
                Authorization: authHeader['Authorization']
            }
        })
        const body = await request.text();

        return Object.fromEntries(new URLSearchParams(body));
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const verifyAndGetAccessTokenTwitterService = async (req, res) => {
    try {
        const { oauthVerifier, oauthToken } = req.body;
        
        if (!oauthToken || !oauthVerifier) return { success: false, status: 400, message: 'Missing Fields!' }

        const res = await axios.post(`https://api.twitter.com/oauth/access_token?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`);

        let jsonStr = '{ "' + res.data.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';

        return { success: true, status: 200, data: JSON.parse(jsonStr) };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

export const getTwitterRequestTokenService = async (req, res) => {
    try {
        const { clientId, clientSecret, callbackUrl, consumerKey, consumerSecret, nonce, signature, signatureMethod, timestamp, version } = req.body;

        debugger
        if (!clientId || !clientSecret || !callbackUrl || !consumerKey || !consumerSecret || !nonce || !signature || !signatureMethod || !timestamp || !version) return { success: false, status: 400, message: 'Missing Fields!' };

        const oAuthRequestToken = await requestToken(consumerKey, consumerSecret, callbackUrl);

        // https://api.twitter.com/oauth/access_token?oauth_token=9Npq8AAAAAAAx72QBRABZ4DAfY9&oauth_verifier=4868795

        // const resp = await axios.post(
        //     'https://api.twitter.com/oauth2/token',
        //     '',
        //     {
        //         params: {
        //             'grant_type': 'client_credentials'
        //         },
        //         auth: {
        //             username: consumerKey,
        //             password: consumerSecret
        //         }
        //     }
        // );
        // console.log(resp.data);

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Credentials': true,
            // "User-Agent": "themattharris' HTTP Client",
            // 'Host': 'api.twitter.com',
            // 'Accept': '*/*',
            'accept': "Accept: application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            "Access-Control-Max-Age": "1800",
            'Access-Control-Allow-Credentials': true,
            'Authorization': `OAuth oauth_callback="${callbackUrl}", oauth_consumer_key="${consumerKey}", oauth_consumer_secret="${consumerSecret}", oauth_nonce="${nonce}", oauth_signature="${signature}", oauth_signature_method="${signatureMethod}", oauth_timestamp="${timestamp}", oauth_version="${version}"`
        };

        const client = new TwitterApi({
            // appId: "28461345",
            // appKey: consumerKey,
            // appSecret: consumerSecret,
            clientId: consumerKey,
            // clientId: 'WEx2SkhJYUFMbkZfcEpWdVZHVmk6MTpjaQ',
            // clientSecret: '16nOMeiFcI_XdleKdtBXjFSpTvZunPPbXKbddgjpp7pr_xxTKA',
            // clientId: consumerKey,
            clientSecret: consumerSecret,
            // appKey: '28461345',
            // consumer_key: consumerKey,
            // consumer_secret: consumerSecret,
        });

        // const authLink1 = await client.generateAuthLink('https://127.0.0.1:3000/settings');
        const authLink2 = await client.generateOAuth2AuthLink('https://127.0.0.1:3000/settings');

        // const loginUser = await client.loginWithOAuth2({
        //     codeVerifier: authLink2.codeVerifier,

        // });

        const tokens = await client.getActiveTokens();
        // const accessToken = await client.getOAuth2AccessToken(authLink2.codeVerifier, authLink2.state);

        const req_token = await axios.post(`https://api.twitter.com/oauth/request_token`, null, { headers });

        res.redirect(authLink2);


        // const access_token = await axios.post('https://api.twitter.com/oauth/access_token', {
        //     oauth_token: 'G2mjPwAAAAABskUaAAABjfOB_1I',
        //     oauth_verifier: 'Y2ECV3ODy8OhyFYRaZijmQYh7PK7JXoA',
        // },
        // {
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Accept': '*/*'
        //     }
        // });

        // return { success: true, status: 200, data: { request: req_token, access: access_token } };
        return { success: true, status: 200, data: req_token };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong!' };
    }
};

export const tweetTextService = async (req, res) => {
    try {
        const { content, accessToken } = req.body;

        if (!content || !accessToken) return { success: false, status: 400, message: 'Missing fields!' };

        debugger
        const client = new TwitterApi({
            appId: "28461345",
            authClientId: "WEx2SkhJYUFMbkZfcEpWdVZHVmk6MTpjaQ",
            authClientSecret: '16nOMeiFcI_XdleKdtBXjFSpTvZunPPbXKbddgjpp7pr_xxTKA',
            appKey: "lU02IaM4BhLDBpBrJxR2t5tSg",
            appSecret: "y3ZEWU0ArHafHBN0L1YcR11gNwc8ij8RX2CjiaVIK7nj7YVXp3",
            accessToken: "1742467594655879168-z0bqNOeiFcxGGNWoHM7jB2uatlWU3g",
            accessSecret: "pDmQwuvUhy9AlZUDHwyYrRRE4Kle6wF6rV9I6g3bXxn3H",
            bearerToken: "AAAAAAAAAAAAAAAAAAAAACFJsgEAAAAAP93M4e8AYsjCHlO%2FewOdXD5DZm8%3DhsHsLnWefBc0U2stodJwJNiwo0pme8mS8GrCpZVGazikQtDROl",
        });

        const rwClient = client.readWrite;

        // Use .tweet() method and pass the text you want to post
        const res = await rwClient.v2.tweet("This tweet has been created using nodejs");

        return { success: true, status: 200, data: res };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong!' };
    }
};

// function readFileAsBuffer(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//             resolve(reader.result);
//         };
//         reader.onerror = error => {
//             reject(error);
//         };
//         reader.readAsArrayBuffer(file);
//     });
// };

const readFileAsBuffer = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Define onload event handler
        reader.onload = function (event) {
            // The result attribute contains the data as a buffer
            resolve(event.target.result);
        };

        // Define onerror event handler
        reader.onerror = function (error) {
            reject(error);
        };

        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
    });
};

export const mediaTweetService = async (req, res) => {
    try {

        const { image, imageUrl, content, accessToken, accessSecret, consumerKey, consumerSecret } = req.body;

        debugger
        if (!image || !imageUrl || !content || !accessToken || !accessSecret || !consumerKey || !consumerSecret) return { success: false, status: 400, message: 'Missing Fields!' };

        // const imgBuffer = await readFileAsBuffer(JSON.parse(image));

        const client = new TwitterApi({
            // appId: "28461345",
            // appKey: "WEx2SkhJYUFMbkZfcEpWdVZHVmk6MTpjaQ",
            // appKey: "lU02IaM4BhLDBpBrJxR2t5tSg",
            // appSecret: "y3ZEWU0ArHafHBN0L1YcR11gNwc8ij8RX2CjiaVIK7nj7YVXp3",
            appKey: consumerKey,
            appSecret: consumerSecret,
            // accessToken: "1742467594655879168-z0bqNOeiFcxGGNWoHM7jB2uatlWU3g",
            // accessSecret: "pDmQwuvUhy9AlZUDHwyYrRRE4Kle6wF6rV9I6g3bXxn3H",
            accessToken: accessToken,
            accessSecret: accessSecret,
            // bearerToken: "AAAAAAAAAAAAAAAAAAAAACFJsgEAAAAAP93M4e8AYsjCHlO%2FewOdXD5DZm8%3DhsHsLnWefBc0U2stodJwJNiwo0pme8mS8GrCpZVGazikQtDROl",
        });

        const rwClient = client.readWrite;

        const uri = "https://i.imgur.com/Zl2GLjnh.jpg";
        // const uri = "https://i.imgur.com/t0xCY3q.jpeg";
        const filename = "image1.png";

        await downloadImage(imageUrl, filename, async function () {
            try {
                debugger
                const mediaId = await client.v1.uploadMedia("./image1.png");
                // const mediaId = await client.v1.uploadMedia("./images/pet1.jpeg");
                await rwClient.v2.tweet({
                    // text: "Hello world! This is an testing tweet!",
                    text: content,
                    media: {
                        media_ids: [mediaId]
                    }
                });
            } catch (e) {
                debugger
                console.log(e)
            }
        });

        // Create mediaID
        // const mediaId = await client.v1.uploadMedia(
        //     // Put path of image you wish to post 
        //     // "./1605232393098780672example.png"
        //     // JSON.parse(image)
        //     imgBuffer
        // );

        // Use tweet() method and pass object with text in text feild and media items in media field
        // const res = await rwClient.v2.tweet({
        //     text: "Twitter is a fantastic social network. Look at this:",
        //     media: { media_ids: [mediaId] },
        // });

        return { success: true, status: 200, data: 'Success!!!' };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong!' };
    }
};




// -------------------------------- Facebook Api's ---------------------------

// Get Page Details
export const getFbPageDetailsService = async (req, res) => {
    try {
        const { accessToken, fbPageId } = req.body;

        if (!accessToken || !fbPageId) return { success: false, status: 400, message: 'Missing Fields!' };

        const { data } = await axios.get(`https://graph.facebook.com/${fbPageId}?fields=name,followers_count,fan_count&access_token=${accessToken}`);
        // const res1 = await axios.get(`https://graph.facebook.com/${fbPageId}?fields=name,followers_count,fan_count&access_token=${accessToken}&time_range[since]=2023-01-01&time_range[until]=2023-01-13`);

        return { success: true, status: 200, data: data };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};


// Get All Post Sub Details (Likes, Comments)
export const getFbAllPostSubDetailsByPageIdService = async (req, res) => {
    try {
        const { pageAccessToken, pageId } = req.body;

        if (!pageAccessToken || !pageId) return { success: false, status: 400, message: 'Missing Fields!' };

        const { data } = await axios.get(`https://graph.facebook.com/${pageId}/posts?fields=likes.summary(true),comments.summary(true)&access_token=${pageAccessToken}`);

        return { success: true, status: 200, data: data };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

// Get Single Post Details
export const getFbPostDetailsByPostIdService = async (req, res) => {
    try {
        const { pageAccessToken, postId } = req.body;

        if (!pageAccessToken || !postId) return { success: false, status: 400, message: 'Missing Fields!' };

        const { data } = await axios.get(`https://graph.facebook.com/${postId}?fields=likes.summary(true),comments.summary(true)&access_token=${pageAccessToken}`);

        return { success: true, status: 200, data: data };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

// Get Page Reach
export const getFbPageReachByPageIdService = async (req, res) => {
    try {
        const { pageAccessToken, pageId, accessToken, appId } = req.body;
        
        if (!pageAccessToken || !pageId) return { success: false, status: 400, message: 'Missing Fields!' };

        // const res = await axios.get(`https://graph.facebook.com/${pageId}/insights?metric=page_views,page_views_unique&access_token=${pageAccessToken}`);
        // const { data } = await axios.get(`https://graph.facebook.com/${pageId}/insights?metric=page_views_total,page_impressions_unique,page_engaged_users&access_token=${pageAccessToken}`);
        const { data } = await axios.get(`https://graph.facebook.com/${pageId}/insights?metric=page_views_total,page_impressions_unique,page_impressions_paid&access_token=${pageAccessToken}`);
        // const { data } = await axios.get(`https://graph.facebook.com/${pageId}/insights?metric=page_impressions_unique,page_engaged_users,page_views&breakdowns=%5B%22age%22%2C%22gender%22%5D&access_token=${pageAccessToken}`);
        // const { data } = await axios.get(`https://graph.facebook.com/${pageId}/insights?metric=page_views,page_views_unique,page_fans_gender_age,page_fans_city,page_impressions_by_age_gender_unique&breakdowns=%5B%22age%22%2C%22gender%22%5D&access_token=${pageAccessToken}`);


        return { success: true, status: 200, data: data };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};




// --------------------------- Instagram ----------------------------

// Get Account Id
export const getInstagramAccountIdService = async (req, res) => {
    try {
        const { longAccessToken } = req.body;
        
        if (!longAccessToken) return { success: false, status: 400, message: 'Missing Fields!' };

        const getAccId = await axios.get(`https://graph.facebook.com/v19.0/me?access_token=${longAccessToken}`);
        const getPageId = await axios.get(`https://graph.facebook.com/v19.0/${getAccId.data.id}/accounts?access_token=${longAccessToken}`);
        const { data } = await axios.get(`https://graph.facebook.com/v19.0/${getPageId.data.data[0].id}?fields=instagram_business_account&access_token=${longAccessToken}`);

        return { success: true, status: 200, data: data };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

// Get User Details
export const getUserDetailsInstagramService = async (req, res) => {
    try {
        const { accessToken, igAccId } = req.body;
        
        if (!accessToken || !igAccId) return { success: false, status: 400, message: 'Missing Fields!' };

        const { data } = await axios.get(`https://graph.facebook.com/v19.0/${igAccId}?fields=biography,id,ig_id,followers_count,follows_count,media_count,name,profile_picture_url,username,website&access_token=${accessToken}`);

        return { success: true, status: 200, data: data };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

// Get All Post Details by User Id
export const getAllPostsDetailsInstagramByUserIdService = async (req, res) => {
    try {
        const { accessToken, igAccId, igUsername } = req.body;

        if (!accessToken || !igAccId || !igUsername) return { success: false, status: 400, message: 'Missing Fields!' };

        const { data } = await axios.get(`https://graph.facebook.com/v19.0/${igAccId}?fields=business_discovery.username(${igUsername}){media{comments_count,like_count}}&access_token=${accessToken}`);

        return { success: true, status: 200, data: data };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};

// Get Page Insights
export const getInstagramPageInsightsService = async (req, res) => {
    try {
        const { igUserId, accessToken } = req.body;

        if (!igUserId  || !accessToken) return { success: false, status: 400, message: 'Missing Fields!' };

        const { data } = await axios.get(`https://graph.facebook.com/${igUserId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${accessToken}`);
        // const { data } = await axios.get(`https://graph.facebook.com/${igUserId}/insights?metric=impressions,reach,profile_views&metric_type=total_value&period=day&access_token=${accessToken}`);

        return { success: true, status: 200, data: data };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};



// --------------------------- Twitter ----------------------------

// Get User Info
export const getTwitterUserInfoService = async (req, res) => {
    try {
        const { consumerKey, consumerSecret, accessToken, accessSecret } = req.body;

        if (!consumerKey || !consumerSecret || !accessToken || !accessSecret) return { success: false, status: 400, message: 'Missing Fields!' };

        const client = new TwitterApi({
            appKey: consumerKey,
            appSecret: consumerSecret,
            accessToken: accessToken,
            accessSecret: accessSecret,
        });
        
        const rwClient = client.readWrite;

        const { data } = await rwClient.v2.get('users/me?user.fields=created_at,description,public_metrics,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld&expansions=pinned_tweet_id&tweet.fields=author_id,created_at');

        return { success: true, status: 200, data: data };
    } catch (error) {
        return { success: false, status: 500, message: 'Something went wrong' };
    }
};