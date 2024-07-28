import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegImage } from "react-icons/fa6";
import { IoIosHeartDislike } from "react-icons/io";
import { RiUserFollowLine } from "react-icons/ri";
import { MdPreview } from "react-icons/md";
import { SlUserFollowing } from "react-icons/sl";
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { getAllPostsDetailsInstagramByUserId, getInstagramAccountId, getInstagramPageInsights, getUserDetailsInstagram } from '../../API/Api';
import { setIgCredential } from '../../redux/features/userDataSlice';
import SocialCard from './SocialCard';
import EngagementRateCard from './EngagementRateCard';
import AgeRangeCard from './AgeRangeCard';
import ContentReachCard from './ContentReachCard';
import GenderCard from './GenderCard';
import LocationsCard from './LocationsCard';
import { postDataCountFunc } from '../../helper';

const Instagram = () => {

    const dispatch = useDispatch();
    const { fbData, igData } = useSelector((state) => state.userData) ?? {};
    const [postCount, setPostCount] = useState(0);
    
    useEffect(() => {
        if (fbData && postCount === 0) postData();
        if (fbData && fbData?.longAccess && !igData) fetchIGAccId();
    }, [JSON.stringify(fbData)]);

    useEffect(() => {
        if (igData?.id && !igData?.igPageDetails) {
            fetchIgDetails();
        }
        // if (igData?.igPageDetails?.id && igData?.igPageDetails?.username && fbData?.longAccess?.access_token && !igData?.igPagePostDetails) {
        //     fetchAllIgPostsDetails();
        // }
    }, [JSON.stringify(igData)]);

    useEffect(() => {
        if (igData?.igPageDetails?.id && igData?.igPageDetails?.username && fbData?.longAccess?.access_token && !igData?.igPagePostDetails) {
            fetchAllIgPostsDetails();
        }
    }, []);

    // Fetch All Posts with Details
    const fetchAllIgPostsDetails = async () => {
        const res = await getAllPostsDetailsInstagramByUserId({ igAccId: igData?.instagram_business_account?.id, accessToken: fbData?.longAccess?.access_token, igUsername: igData?.igPageDetails?.username });
        const insights = await getInstagramPageInsights({ igUserId: igData?.igPageDetails?.id, accessToken: fbData?.longAccess?.access_token });
        if (res.status === 200) dispatch(setIgCredential({ ...igData, igPagePostDetails: res.data }));
        if (insights.status === 200) dispatch(setIgCredential({ ...igData, pageInsightData: insights.data }));
    };

    // Fetch Page Details
    const fetchIgDetails = async () => {
        const res = await getUserDetailsInstagram({ igAccId: igData?.instagram_business_account?.id, accessToken: fbData?.longAccess?.access_token });
        if (res.status === 200) {
            dispatch(setIgCredential({ ...igData, igPageDetails: res.data }));
        }
    };

    // Fetch Account Id
    const fetchIGAccId = async () => {
        if (fbData && fbData?.longAccess) {
            const res = await getInstagramAccountId({ longAccessToken: fbData?.longAccess?.access_token });
            if (res.status === 200) {
                dispatch(setIgCredential(res.data));
            }
        }
    };

    const getTotalLikes = () => {
        let count = 0;
        if (igData?.igPageDetails?.media_count > 0) {
            igData?.igPagePostDetails?.business_discovery?.media?.data?.forEach(o => {
                count = Number(count) + Number(o?.like_count);
            });
        }
        return count;
    };

    const postData = () => {
        const temp = postDataCountFunc(fbData?.pageDetails?.postData);
        setPostCount(temp);
    };

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
                    count={igData?.igPageDetails?.followers_count??0}
                    lastMonthAverage={postCount}
                />
                <SocialCard
                    icon={<SlUserFollowing className='cardIcon' />}
                    cardName='Followings'
                    count={igData?.igPageDetails?.follows_count??0}
                    lastMonthAverage={postCount}
                />
                <SocialCard 
                    icon={<FaRegImage className='cardIcon' />}
                    cardName='Posts'
                    count={igData?.igPageDetails?.media_count??0}
                    lastMonthAverage={postCount}
                />
                <SocialCard 
                    icon={<IoIosHeartDislike className='cardIcon' />}
                    cardName='Likes'
                    count={getTotalLikes()}
                    lastMonthAverage={postCount}
                />
                {/* <SocialCard 
                    icon={<MdPreview className='cardIcon' />}
                    cardName='Views'
                    count={igData?.pageInsightData?.data?.find(o => o.name === 'profile_views')?.values[1]?.value}
                    lastMonthAverage={postCount}
                /> */}
            </Row>

            <Row align='top' justify='' className='marginCardTop'>
                <EngagementRateCard />
                {/* <AgeRangeCard colCount={8} /> */}
                <AgeRangeCard colCount={8} mRight={true} />
                <SocialCard 
                    icon={<MdPreview className='cardIcon' />}
                    cardName='Views'
                    count={igData?.pageInsightData?.data?.find(o => o.name === 'profile_views')?.values[1]?.value}
                    lastMonthAverage={postCount}
                    // className='engageRateCard'
                />
                <Col xl={5} lg={5} md={5} sm={5} xs={5}></Col>
            </Row>

            <Row align='top' justify='space-between' className='marginCardTop'>
                <ContentReachCard />
                <GenderCard />
                <LocationsCard />
            </Row>
        </div>
    );
}

export default Instagram;