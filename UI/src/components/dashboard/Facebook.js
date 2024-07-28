import { Card, Col, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegImage } from "react-icons/fa6";
import { IoIosHeartDislike } from "react-icons/io";
import { RiUserFollowLine } from "react-icons/ri";
import { MdPreview } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { getFbAllPostSubDetailsByPageId, getFbPageAccessToken, getFbPageDetails, getFbPageReachByPageId, getFbPostDetailsByPostId } from '../../API/Api';
import { setFbCredential } from '../../redux/features/userDataSlice';
import SocialCard from './SocialCard';
import EngagementRateCard from './EngagementRateCard';
import AgeRangeCard from './AgeRangeCard';
import ContentReachCard from './ContentReachCard';
import GenderCard from './GenderCard';
import LocationsCard from './LocationsCard';
import { engagementRateData, postDataCountFunc } from '../../helper';
import { FundOutlined } from '@ant-design/icons';

const Facebook = () => {

    const dispatch = useDispatch();
    const { fbData } = useSelector((state) => state.userData) ?? {};
    const [postCount, setPostCount] = useState(0);
    const [mostTopPost, setMostTopPost] = useState([]);
    const [engagementValues, setEngagementValues] = useState(null);

    useEffect(() => {
        if (fbData?.pageDetails?.postData?.length > 0) {
            const temp = [...fbData?.pageDetails?.postData];
            setMostTopPost(temp?.sort((a, b) => b?.likes?.summary?.total_count - a?.likes?.summary?.total_count)?.slice(0, 5));
        }
    }, [JSON.stringify(fbData?.pageDetails?.postData)]);
    
    useEffect(() => {
        if (fbData?.pageDetails?.postData && postCount === 0) postData();
        if (fbData?.pageReach?.data) pageInsightData();
        if (fbData && !fbData?.pageDetails) fetchFbPageDetails();
        if (fbData && fbData?.pageAccess) {
            if (!fbData?.pageDetails?.postData) fetchAllFbPosts();
            if (!fbData?.pageReach) fetchFbPageReach();
        }
    }, [JSON.stringify(fbData)]);

    // Fetch Page Reach
    const fetchFbPageReach = async () => {
        const res = await getFbPageReachByPageId({
            pageAccessToken: fbData?.pageAccess?.data?.data[0]?.access_token,
            pageId: fbData?.pageAccess?.data?.data[0]?.id,
            // accessToken: fbData?.longAccess?.access_token,
            // appId: fbData?.id
        });
        if (res.status === 200) {
            dispatch(setFbCredential({ ...fbData, pageReach: res.data.data }));
        }
    };

    // Fetch All Posts Data
    const fetchAllFbPosts = async () => {
        let payload = { pageAccessToken: fbData?.pageAccess?.data?.data[0]?.access_token, pageId: fbData?.pageAccess?.data?.data[0]?.id };
        const res = await getFbPostDetailsByPostId(payload);
        const res1 = await getFbAllPostSubDetailsByPageId(payload);
        if (res.status === 200) {
            let temp = res.data?.data?.data.map((item, i) => Object.assign({}, item, res1.data?.data?.data[i]));
            dispatch(setFbCredential({ ...fbData, pageDetails: { ...fbData?.pageDetails, postData: temp } }));
        }
    };

    // Fetch Page Details
    const fetchFbPageDetails = async () => {
        let tempPageAccess = null;
        // Fetch Page Access Token
        if (!fbData?.pageAccess) {
            const result = await getFbPageAccessToken({
                accessToken: fbData.accessToken,
                longAccessToken: fbData.longAccess.access_token,
                userId: process.env.REACT_APP_FB_APP_ID,
                appSecret: process.env.REACT_APP_FB_APP_SECRET
            });
            if (result.status === 200) {
                tempPageAccess = result.data;
                localStorage.setItem('fbPageAccess', JSON.stringify(result.data));
                dispatch(setFbCredential({ ...fbData, pageAccess: result.data }));
            }
        }
        
        const res = await getFbPageDetails({
            fbPageId: fbData?.pageAccess ? fbData?.pageAccess?.data?.data[0]?.id : tempPageAccess?.data?.data[0]?.id,
            accessToken: fbData?.longAccess?.access_token
        });
        if (res.status === 200) {
            dispatch(setFbCredential({ ...fbData, pageDetails: { ...fbData?.pageDetails, ...res.data.data } }));
        }
    };

    const getTotalLikes = () => {
        let count = 0;
        fbData?.pageDetails?.postData?.forEach(o => {
            count = Number(count) + Number(o.likes?.summary?.total_count);
        });
        return count;
    };

    const pageInsightData = async (period = 'days_28') => {
        const temp = engagementRateData(fbData?.pageReach?.data, period);
        setEngagementValues(temp);
    };

    const postData = () => {
        const temp = postDataCountFunc(fbData?.pageDetails?.postData);
        setPostCount(temp);
    };

    const postColumns = [
        {
            title: 'Content',
            dataIndex: 'message',
        },
        {
            title: 'Shared on',
            dataIndex: 'created_time',
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
        },
        {
            title: 'Total Likes',
            dataIndex: 'likes',
            render: (val) => val ? <div>{val?.summary?.total_count}</div> : <div>-</div>
        },
        {
            title: 'Total Comments',
            dataIndex: 'comments',
            render: (val) => val ? <div>{val?.summary?.total_count}</div> : <div>-</div>
        },
    ];

    return (
        <div className='tabBodyTopMargin'>
            <Row align='middle' justify='space-between'>
                <Col xl={24} lg={24} md={24} sm={24} xs={24} className='textAlignEnd dateFont'>
                    <span>Last Updated: {dayjs(new Date()).format('DD MMMM YYYY')}</span>
                </Col>
            </Row><br />

            <Row align='top' justify=''>
                <SocialCard
                    icon={<RiUserFollowLine className='cardIcon' />}
                    cardName='Followers'
                    count={fbData?.pageDetails?.followers_count || 0}
                    lastMonthAverage={postCount}
                />
                <SocialCard
                    icon={<FaRegImage className='cardIcon' />}
                    cardName='Posts'
                    count={fbData?.pageDetails?.postData?.length || 0}
                    lastMonthAverage={postCount}
                />
                <SocialCard
                    icon={<IoIosHeartDislike className='cardIcon' />}
                    cardName='Likes'
                    count={getTotalLikes()}
                    lastMonthAverage={postCount}
                />
                <SocialCard
                    icon={<MdPreview className='cardIcon' />}
                    cardName='Views'
                    count='N/A'
                    searchData={fbData?.pageReach?.data}
                    searchField='page_views_total'
                    isDropdown={true}
                    lastMonthAverage={postCount}
                />
            </Row>

            <Row align='top' className='marginCardTop'>
                <EngagementRateCard fbPageInsightData={pageInsightData} fbEngagementValues={engagementValues} />
                <AgeRangeCard />
            </Row>

            <Row>
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Card className='ageRangeCard marginCardTop'>
                        <Row><FundOutlined className='cardIcon' /><h3 className='iconRight'>Most Top Post</h3></Row>
                        <br/>
                        <Table
                            columns={postColumns}
                            bordered={false}
                            pagination={false}
                            dataSource={mostTopPost}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>

            <Row align='top' justify='space-between' className='marginCardTop'>
                <ContentReachCard />
                <GenderCard />
                <LocationsCard />
            </Row>
        </div>
    );
}

export default Facebook;