import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import { Card, Col, Empty, Row, Tabs, Spin } from 'antd';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';
import Chart from 'chart.js/auto';
import { getAllPostsDetailsInstagramByUserId, getFbAllPostSubDetailsByPageId, getFbPageAccessToken, getFbPageDetails, getFbPageReachByPageId, getFbPostDetailsByPostId, getInstagramAccountId, getInstagramPageInsights, getLinkedinUserInfo, getTwitterUserInfo, getUserDetailsInstagram } from '../API/Api';
import { useDispatch, useSelector } from 'react-redux';
import { setFbCredential, setIgCredential, setLinkedinCredential, setTwitterCredential } from '../redux/features/userDataSlice';
import Selectable from '../components/Selectable';
import { timePeriodList } from '../constants';
import Facebook from '../components/dashboard/Facebook';
import Instagram from '../components/dashboard/Instagram';
import Twitter from '../components/dashboard/Twitter';
import AppButton from '../components/AppButton';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import Linkedin from '../components/dashboard/Linkedin';

const Dashboard = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fbData, twitterData, igData, linkedinData } = useSelector((state) => state.userData) ?? {};
    const [engagementRate, setEngagementRate] = useState('-');
    const [currActiveTab, setCurrActiveTab] = useState('facebook');
    const [isLoading, setIsLoading] = useState(true);
    const [tabLoading, setTabLoading] = useState({ facebook: true });
    
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
            setTabLoading(prevState => ({
                ...prevState,
                [currActiveTab]: false
            }));
        }, 2000);
    }, [currActiveTab]);

    const onTabChange = (val) => {
        setCurrActiveTab(val);
        setTabLoading(prevState => ({
            ...prevState,
            [val]: true
        }));
    };

    const EmptyCard = () => {
        return (
            <Empty
                className='emptyDataComp'
                description="Seems You haven't add your account!"
            >
                <AppButton className='appPrimaryButton addAccountBtn' label='Add Account' onClick={() => navigate('/settings')} />
            </Empty>
        )
    };

    const items = [
        {
            key: 'facebook',
            label: 'Facebook',
            children: <>
                {tabLoading[currActiveTab] ? (
                    <Spin indicator={<LoadingOutlined className='spinLoader' spin />} />
                ) : (fbData ? <Facebook /> : <EmptyCard />)}
            </>
        },
        {
            key: 'linkedin',
            label: 'Linkedin',
            children: <>
                {tabLoading[currActiveTab] ? (
                    <Spin indicator={<LoadingOutlined className='spinLoader' spin />} />
                ) : (linkedinData ? <Linkedin /> : <EmptyCard />)}
            </>
        },
        {
            key: 'instagram',
            label: 'Instagram',
            children: <>
                {tabLoading[currActiveTab] ? (
                    <Spin indicator={<LoadingOutlined className='spinLoader' spin />} />
                ) : (fbData ? <Instagram /> : <EmptyCard />)}
            </>
        },
        {
            key: 'twitter',
            label: 'Twitter',
            children: <>
                {tabLoading[currActiveTab] ? (
                    <Spin indicator={<LoadingOutlined className='spinLoader' spin />} />
                ) : (twitterData ? <Twitter /> : <EmptyCard />)}
            </>
        }
    ];

    return (
        <div className='mainInsideDiv'>

            <Row align='middle' justify='space-between'>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    {/* <Card className='card-5'> */}
                        <Tabs className='dashboardTab' defaultActiveKey={currActiveTab} items={items} onChange={onTabChange} />
                    {/* </Card> */}
                </Col>
            </Row>

        </div>
    );
}

export default Dashboard;