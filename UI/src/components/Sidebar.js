import { FileAddOutlined, HomeOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { SiThreedotjs } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {

    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [defaultActiveBar, setDefaultActiveBar] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (window.location.href.endsWith('/')) setDefaultActiveBar('');
        if (window.location.href.endsWith('/settings')) setDefaultActiveBar('settings');
        if (window.location.href.endsWith('/share-post')) setDefaultActiveBar('share-post');
        setSiderMenuItems();
        setIsLoading(false);
    }, []);

    const getItem = (label, key, icon, children) => {
        return { key, icon, children, label };
    };

    const handleOnClick = (e) => {
        navigate(e.key);
    };

    const setSiderMenuItems = () => {
        let items = [
            getItem('Dashboard', '', <HomeOutlined />),
            getItem('Overview', 'overview', <MailOutlined />),
            getItem('Share Post', 'share-post', <FileAddOutlined />),
            getItem('Settings', 'settings', <SettingOutlined />),
            // getItem('More', 'more', <SiThreedotjs />, [
            //     getItem('Option 7', '7'),
            //     getItem('Option 8', '8'),
            //     getItem('Option 9', '9'),
            //     getItem('Option 10', '10'),
            // ]),
            getItem('About', 'about', <SiThreedotjs />),
        ];
        setMenuItems(items);
    };

    if (isLoading) {
        return "Loading";
    }

    return (
        <Menu
            // theme="dark"
            mode="inline"
            style={{ height: 'inherit' }}
            defaultSelectedKeys={[defaultActiveBar]}
            items={menuItems}
            onClick={handleOnClick}
        />
    )
}

export default Sidebar;