/*global FB*/
import React, { useEffect, useMemo, useState } from 'react';
import { Card, Row, Form, Col, Upload, Button, Checkbox, Input, Popover, message, Popconfirm } from 'antd';
import { PlusOutlined, LockOutlined, UserOutlined, InstagramOutlined, FacebookOutlined, TwitterOutlined, LineOutlined, LinkedinOutlined, PlusSquareOutlined } from '@ant-design/icons';
import '../styles/settings.css';
import TextInput from '../components/TextInput';
import AppButton from '../components/AppButton';
import { pet_page_id } from '../constants';
import { authLinkedin, getFbPageAccessToken, getLongAccessToken, getTwitterOAuthByAuth, getTwitterRequestToken, sharePagePost, verifyAndGetAccessTokenTwitter } from '../API/Api';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import { setCurrLongAccessToken, setFbCredential, setIgCredential, setLinkedinCredential, setTwitterCredential } from '../redux/features/userDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Settings = () => {

    const initialAccList = [
        { title: 'Instagram', count: 0, icon: <InstagramOutlined className='instagram' /> },
        { title: 'Facebook', count: 0, icon: <FacebookOutlined className='instagram' /> },
        { title: 'Twitter', count: 0, icon: <TwitterOutlined className='instagram' /> },
        { title: 'LinkedIn', count: 0, icon: <LinkedinOutlined className='instagram' /> }
    ];

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fbData, igData, linkedinData, twitterData } = useSelector((state) => state.userData) ?? {};
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState('vertical');
    const [arrow, setArrow] = useState('Show');
    const [isFBLogin, setIsFBLogin] = useState(false);
    const [accountsList, setAccountsList] = useState(initialAccList);

    useEffect(() => {
        if (fbData || linkedinData || twitterData) {
            setAccountsList(accountsList.map(o => {
                if ((o.title === 'Facebook' && fbData) || (o.title === 'Instagram' && fbData)) {
                    return { ...o, count: 1 };
                } else if (o.title === 'LinkedIn' && linkedinData) {
                    return { ...o, count: 1 };
                } else if (o.title === 'Twitter' && twitterData) {
                    return { ...o, count: 1 };
                } else return o;
            }));
        }
    }, [JSON.stringify(fbData), JSON.stringify(linkedinData), JSON.stringify(twitterData)]);

    useEffect(() => {
        if ((window.location.search).length > 0) {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
                // getAccessToken(code);
                handleLinkedinAuth(code);
            }
            const oauth_token = urlParams.get('oauth_token');
            const oauth_verifier = urlParams.get('oauth_verifier');
            if (oauth_token && oauth_verifier) {
                handleTwitterVerificationCode(oauth_token, oauth_verifier);
            }
        }
    }, []);

    const onFormLayoutChange = ({ layout }) => {
        setFormLayout(layout);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
    };

    const handleAddAccount = (item) => {
        if (item.title === 'LinkedIn') {
            getCode();
        }
        if (item.title === 'Twitter') {
            handleTwitterAuth();
        }
    };

    const responseFacebook = async (res, type) => {
        if (res.status !== 'unknown') {
            dispatch(setFbCredential(res));
        }

        const long_access_token = await getLongAccessToken({
            accessToken: res.accessToken,
            userId: process.env.REACT_APP_FB_APP_ID,
            appSecret: process.env.REACT_APP_FB_APP_SECRET
        });

        if (long_access_token.status === 200) {
            dispatch(setCurrLongAccessToken(long_access_token.data));
            dispatch(setFbCredential({ ...res, longAccess: long_access_token.data.data }));
            if (type === 'Instagram') {
                setAccountsList(accountsList.map(o => {
                    if (o.title === 'Instagram' && fbData) {
                        return { ...o, count: 1 }
                    } else return o;
                }));
            }
        }

    };

    const getCode = async () => {
        try {
            const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=${process.env.REACT_APP_LINKEDIN_RESPONSE_TYPE}&client_id=${process.env.REACT_APP_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_LINKEDIN_REDIRECT_URI}&state=${process.env.REACT_APP_LINKEDIN_STATE}&scope=${process.env.REACT_APP_LINKEDIN_SCOPE}`;
            window.location.href = authorizationUrl;
        } catch (error) {
            console.error('Error fetching authorization url:', error);
        }
    };

    const handleLinkedinAuth = async (code) => {
        const res = await authLinkedin({
            grantType: process.env.REACT_APP_LINKEDIN_GRANT_TYPE,
            code: code,
            clientSecret: process.env.REACT_APP_LINKEDIN_CLIENT_SECRET,
            clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
            redirectUrl: process.env.REACT_APP_LINKEDIN_REDIRECT_URI
        });
        if (res.status === 200) {
            dispatch(setLinkedinCredential(res.data));
            message.success('LinkedIn Account Added Successfully.');
        } else message.error('Something went wrong!');
        navigate('/settings');
    };

    // ##================Twitter-Auth==============##
    const handleTwitterVerificationCode = async (oauth_token, oauth_verifier) => {
        const res = await verifyAndGetAccessTokenTwitter({
            oauthToken: oauth_token,
            oauthVerifier: oauth_verifier
        });
        if (res.status === 200) {
            dispatch(setTwitterCredential(res.data));
            navigate(`/settings`);
        }
    };

    const tweetLogin = () => {
        (async () => {
            try {
                //OAuth Step 1
                const response = await axios({
                    url: `https://api.twitter.com/oauth/request_token`,
                    method: 'POST'
                });

                const { oauth_token } = response.data;
                //Oauth Step 2
                window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
                // https://api.twitter.com/oauth/authenticate?oauth_token=${step-1 oauth_token}
            } catch (error) {
                console.error(error);
            }

        })();
    };

    const handleTwitterAuth = async () => {

        const consumerKey = 'diOfW1TThaZJSrAexO2KqQ5Lx';
        const consumerSecret = 'zhWIX8VICHOI3o1fd4rSVR1KFGycY63J7RzlrvmfXGvicuEPl7';
        const bearerToken = 'AAAAAAAAAAAAAAAAAAAAACFJsgEAAAAAmlr8QY9nsGuORs%2FcXmtdoKzkhyQ%3DYU6GRZ9vu9cR3ExSAxexCwxLTLczRwYGRMOAS8BBbaOuXmKGmR';
        const accessToken = '1742467594655879168-sESDWrcrgVdCqlMkf8VO7PtzhAet3m';
        const accessTokenSecret = '5KoHK4nys0JhCslSapADXFoMfegAjx0MG1xeDbFod0OkR';
        const clientId = 'WEx2SkhJYUFMbkZfcEpWdVZHVmk6MTpjaQ';
        const clientSecret = 'OWuFN5IFuZvY5SjBmQYFS5634pGTf1kVT0nFP1FXjxEr5UdRYh';

        const resByAuth = await getTwitterOAuthByAuth({
            consumerKey: process.env.REACT_APP_TWT_CONSUMER_KEY,
            consumerSecret: process.env.REACT_APP_TWT_CONSUMER_SECRET,
            callbackUrl: process.env.REACT_APP_TWT_CALLBACK_URL
        });

        if (resByAuth.status === 200) {
            window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${resByAuth.data.oauth_token}`;
        } else message.error('Somthing went wrong in auth twitter!');

    };

    const formItemLayout =
        formLayout === 'vertical'
            ? {
                labelCol: {
                    span: 4,
                },
                wrapperCol: {
                    span: 14,
                },
            }
            : null;
    const buttonItemLayout =
        formLayout === 'vertical'
            ? {
                wrapperCol: {
                    span: 14,
                    offset: 4,
                },
            }
            : null;

    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }

        if (arrow === 'Show') {
            return true;
        }
        return {
            pointAtCenter: true,
        };
    }, [arrow]);

    const content = (
        <div>
            <p className='pop-account'>Subscription until 22.02.2024</p>
            <p>Connected accounts:</p>
            <h1>0/2</h1>
            <hr />
            <p>More accounts to subscribe</p>
            <p className='Business'>Business</p>
            <AppButton className='appPrimaryButton pop-btn' label='Compare subscription' />
        </div>
    );

    const handleResetAccount = (item) => {
        if (item.title === 'Facebook') dispatch(setFbCredential(null));
        if (item.title === 'Instagram') dispatch(setIgCredential(null));
        if (item.title === 'LinkedIn') dispatch(setLinkedinCredential(null));
        if (item.title === 'Twitter') dispatch(setTwitterCredential(null));
    };

    const ResetConfirm = ({ item }) => {
        return (
            <Popconfirm
                title="Remove the Account?"
                onConfirm={() => {
                    handleResetAccount(item);
                    setAccountsList(accountsList?.map(o => {
                        if ((item?.title === 'Facebook') || (item?.title === 'Instagram')) {
                            return { ...o, count: 0 };
                        } else if (item?.title === 'LinkedIn') {
                            return { ...o, count: 0 };
                        } else if (item?.title === 'Twitter') {
                            return { ...o, count: 0 };
                        } else return o;
                    }));
                    message.success('Account Removed.')
                }}
                // onCancel={() = {}}
                okText="Yes"
                cancelText="No"
            >
                <span className='restSpan'>Reset</span>
            </Popconfirm>
        )
    };

    return (
        <>
            {!isFBLogin &&
                <div className='mainInsideDiv'>
                    <br />
                    <Card className='card-setting minPadding'>
                        <h2>Settings</h2>
                    </Card>
                    <Card className='card-setting'>
                        <div className='main'>
                            <Row align='middle' justify='flex-start'>
                                <Col xl={5} lg={5} md={5} sm={5} xs={5} className='img-upload'>
                                    <div className='form'>
                                        <Form.Item label="" valuePropName="fileList" getValueFromEvent={normFile} className='upload'>
                                            <Upload action="/upload.do" listType="picture-circle" className='upload'>
                                                <button className='upload-an-image' type="button">
                                                    <PlusOutlined />
                                                    <div className='plus'>
                                                        Upload
                                                    </div>
                                                </button>
                                            </Upload>
                                        </Form.Item>
                                        <Form.Item>
                                            <AppButton className='appPrimaryButton image-btn' label='Upload an Image' />
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                                    <h3 className='gen-info'>General information</h3>
                                    <Form
                                        {...formItemLayout}
                                        layout={formLayout}
                                        form={form}
                                        initialValues={{
                                            layout: formLayout,
                                        }}
                                        onValuesChange={onFormLayoutChange}
                                        style={{
                                            maxWidth: formLayout === 'inline' ? 'none' : 600,
                                        }}
                                    >
                                        <Form.Item label="Name">
                                            <Input placeholder="Enter your name" className='input' />
                                        </Form.Item>
                                        <Form.Item label="Email">
                                            <Input placeholder="Please enter email" className='input' />
                                        </Form.Item>
                                        <div className='change-password'>Change Password</div>
                                    </Form>
                                </Col>
                                <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                                    <div className='pop-over'>
                                        <Popover placement="bottomLeft" content={content} arrow={mergedArrow}>
                                            <h2>Account: 2</h2>
                                            <p>until 22.02.2024</p>
                                        </Popover>
                                    </div>
                                </Col>
                            </Row>
                            <div>
                            </div>
                        </div>
                    </Card>
                    <Card className='card-setting'>
                        <h2>Account connection</h2>
                        <div className='account'>
                            {accountsList.map((item, index) => (
                                <Card className='card-account' key={index}>
                                    <div className='logo-account'>
                                        {item.icon}
                                        {/* <PlusOutlined className='plus-account' onClick={() => handleAddAccount(item)} /> */}
                                        {item.title === 'Facebook' || item.title === 'Instagram' ?
                                            <FacebookLogin
                                                appId={process.env.REACT_APP_FB_APP_ID}
                                                autoLoad={true}
                                                fields="name,email,picture"
                                                // scope="pages_manage_ads,pages_manage_metadata,pages_manage_posts,pages_manage_cta,manage_pages,ads_management,ads_read,read_insights,pages_show_list,business_management,instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_content_publish,instagram_branded_content_brand,instagram_branded_content_creator,instagram_branded_content_ads_brand,instagram_manage_events,pages_read_engagement,pages_read_user_content,pages_manage_engagement"
                                                scope="pages_manage_ads,pages_manage_metadata,pages_manage_posts,pages_manage_cta,ads_management,ads_read,read_insights,pages_show_list,business_management,instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_content_publish,instagram_branded_content_brand,instagram_branded_content_creator,instagram_branded_content_ads_brand,instagram_manage_events,pages_read_engagement,pages_read_user_content,pages_manage_engagement"
                                                callback={(res) => responseFacebook(res, item.title)}
                                                version='v19.0'
                                                onFailure={(res) => responseFacebook(res, item.title)}
                                                textButton=''
                                                size='small'
                                                cssClass='fbAddAccountIcon'
                                                // buttonStyle={{ backgroundColor: 'red', padding: '0', border: 'none' }}
                                                icon={<PlusOutlined style={{ fontSize: '22px' }} />}
                                            />
                                            :
                                            <PlusOutlined className='plus-account' onClick={() => handleAddAccount(item)} />
                                        }
                                    </div>
                                    <p>{item.title}: {item.count}</p>
                                    {item.title === 'Facebook' && fbData && <ResetConfirm item={item} />}
                                    {item.title === 'Instagram' && igData && <ResetConfirm item={item} />}
                                    {item.title === 'LinkedIn' && linkedinData && <ResetConfirm item={item} />}
                                    {item.title === 'Twitter' && twitterData && <ResetConfirm item={item} />}
                                </Card>
                            ))}
                        </div>
                    </Card>
                </div>
            }
        </>
    );
}

export default Settings;