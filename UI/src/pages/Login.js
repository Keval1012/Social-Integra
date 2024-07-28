import { Checkbox, Divider, Form } from 'antd';
import React, { useContext, useEffect } from 'react'
import TextInput from '../components/TextInput';
import { GoogleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import '../styles/login.css';
import AppButton from '../components/AppButton';
import { getUserGoogleLoginInfo } from '../API/Api';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext)??{};

    useEffect(() => {
        if (localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') {
            return navigate('/');
        }
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        const res = await getUserGoogleLoginInfo();
        if (res.status === 200) {
            let temp = Object.keys(res.data.data)?.length;
            let isValid = false, tempIndex = 0;
            for (let i = 0; i < temp; i++) {
                if (JSON.parse(Object.values(res?.data?.data)[i])?.userInfo) {
                    tempIndex = i;
                    isValid = true;
                }
            }
            if (res?.data?.data && Object.values(res?.data?.data)[tempIndex] && isValid) {
                localStorage.setItem('user-info', JSON.stringify(JSON.parse(Object.values(res.data.data)[tempIndex]).userInfo));
                localStorage.setItem('token', JSON.parse(Object.values(res.data.data)[tempIndex]).userInfo?.token);
                setUser(JSON.parse(Object.values(res.data.data)[tempIndex]).userInfo);
                return navigate('/');
            }
        }
    };

    const onFinish = values => {
        console.log('Received values of form: ', values);
    };

    const handleLogin = () => {
        window.location.href = 'http://localhost:4002/auth/google';
    };

    return (
        <Form
            name="normal_login"
            className="loginForm"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <h2>Welcome back!</h2>
            <br />
            <TextInput
                type='text'
                placeholder='Username'
                name='loginUsername'
                required={true}
                prefix={<UserOutlined className="site-form-item-icon" />}
                requiredMsg='Please input your Username!'
            />
            <TextInput
                type='password'
                placeholder='Password'
                name='loginPassword'
                required={true}
                prefix={<LockOutlined className="site-form-item-icon" />}
                requiredMsg='Please input your Password!'
            />
            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                    Forgot password
                </a>
            </Form.Item>

            <Form.Item>
                <AppButton type="primary" htmlType="submit" label='Log in' className="appPrimaryButton login-form-button" />
                Or <a href="">register now!</a>
            </Form.Item>

            <Divider children='OR' orientation='center' />

            <Form.Item>
                <AppButton label='Continue with Google' icon={<GoogleOutlined />} onClick={handleLogin} className="appButton login-form-button" />
            </Form.Item>

        </Form>
    );
};

export default Login