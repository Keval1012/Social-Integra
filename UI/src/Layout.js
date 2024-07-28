import React, { useContext, useEffect, useState } from 'react';
import { DownOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, CompassOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, ConfigProvider, Dropdown, Modal, message, Row } from 'antd';
import MainRoutes from './Routes';
import { AuthContext } from './context/AuthProvider';
import { useNavigate } from 'react-router-dom';
// import './styles/navbar.css';
import AppButton from './components/AppButton';
import Sidebar from './components/Sidebar';

const Layouts = () => {

    const { userId, user, setUser, setUserId, currUserData, isDesktop, isMobile, isTablet } = useContext(AuthContext) ?? {};
    const navigate = useNavigate();
    const { Header, Content, Footer, Sider } = Layout;
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [activeNavKey, setActiveNavKey] = useState(1);
    const [collapsed, setCollapsed] = useState(false);

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: `Logout`,
            content: 'Are you sure you want to Logout?',
            okText: 'Logout',
            okType: 'danger',
            onOk: async () => {
                setUser(null);
                setUserId('');
                localStorage.clear();
                navigate('/login');
                message.success('You are successfully logout.');
            },
            onCancel() { },
        });
    };

    const items = [
        {
            label: (
                <p>Change Password</p>
            ),
            key: 'changePassword',
            onClick: (e) => handleMenuClick(e)
        },
        {
            label: (
                <p>Logout</p>
            ),
            key: 'logout',
            onClick: (e) => handleMenuClick(e)
        },
    ];

    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            showDeleteConfirm();
        }
        if (e.key === 'changePassword') {
            // setChangePasswordModalOpen(true);
        }
    };

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        // colorPrimary: 'black',
                        // colorPrimary: '#2276e3',
                        fontFamily: 'Rubik,Avenir,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                        borderRadius: 2,
                        // colorBgContainer: '#003b95',
                    },
                    algorithm: theme.compactAlgorithm,
                }}
            >
                <Layout className='mainLayout'>
                    {/* {user && <Sider trigger={null} collapsible collapsed={collapsed}>
                        <div className="demo-logo-vertical" />
                        <Sidebar />
                    </Sider>} */}
                    <Header
                        className='header'
                        style={{
                            background: colorBgContainer,
                            flexDirection: isTablet ? 'column' : 'row',
                            height: isTablet ? '5.5rem' : null
                        }}
                    >
                        <div className='navbar d-flex-between'>
                            <div className='d-flex-between'>
                                {/* <img src={logo} className="logoIcon" alt="logo" /> */}
                                <CompassOutlined className='logoIcon' /><h2>Socialintegra</h2>
                            </div>
                            {user &&
                                <Dropdown menu={{ items }} >
                                    {(isMobile && !isDesktop && !isTablet) ?
                                        <div className='userProfileDiv'>
                                            <UserOutlined className='userIcon' />
                                            {/* <span className='userTitle'>User</span> */}
                                            {/* {currUserData?.name}
                                            <DownOutlined className='userDownArrow' /> */}
                                        </div>
                                        :
                                        <div className='userProfileDiv'>
                                            <UserOutlined className='userIcon' />
                                            {/* <span className='userTitle'>User</span> */}
                                            {JSON.parse(currUserData)?.profile?.displayName}
                                            <DownOutlined className='userDownArrow' />
                                        </div>
                                    }
                                </Dropdown>
                            }
                            {/* {!user &&
                                <AppButton
                                    className='navbarLoginBtn appButton'
                                    label='Login/SignUp'
                                    onClick={() => {
                                        setLoginModalOpen(true);
                                    }}
                                />
                            } */}
                        </div>
                    </Header>
                    <Layout>
                        {user && <Sider className='siderMenu' trigger={null} collapsible collapsed={collapsed}>
                            <div className="demo-logo-vertical" />
                            <Sidebar />
                        </Sider>}
                        <Content
                            style={{
                                // margin: '24px 16px',
                                // padding: '24px 50px',
                                minHeight: '90vh',
                                // minHeight: '80vh',
                                height: '90vh',
                                overflowY: 'scroll',
                                background: colorBgContainer,
                            }}
                        >
                            <MainRoutes />
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </>
    )
}

export default Layouts;