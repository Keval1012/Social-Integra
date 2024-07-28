import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegImage } from "react-icons/fa6";
import { IoIosHeartDislike } from "react-icons/io";
import { RiUserFollowLine } from "react-icons/ri";
import { MdPreview } from "react-icons/md";
import { SlUserFollowing } from "react-icons/sl";
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { getTwitterUserInfo } from '../../API/Api';
import { setTwitterCredential } from '../../redux/features/userDataSlice';
import SocialCard from './SocialCard';
import EngagementRateCard from './EngagementRateCard';
import AgeRangeCard from './AgeRangeCard';
import ContentReachCard from './ContentReachCard';
import GenderCard from './GenderCard';
import LocationsCard from './LocationsCard';
import { postDataCountFunc } from '../../helper';

const Twitter = () => {

    const dispatch = useDispatch();
    const { fbData, twitterData } = useSelector((state) => state.userData) ?? {};
    const [postCount, setPostCount] = useState(null);
    
    useEffect(() => {
        fetchTwitterPageData();
    }, [JSON.stringify(twitterData)]);

    useEffect(() => {
        if (fbData?.pageDetails?.postData?.length > 0 && !postCount) postData();
    }, [JSON.stringify(fbData)]);

    // Fetch Page Details
    const fetchTwitterPageData = async () => {
        if (twitterData && !twitterData?.pageDetails) {
            const res = await getTwitterUserInfo({
                consumerKey: process.env.REACT_APP_TWT_CONSUMER_KEY,
                consumerSecret: process.env.REACT_APP_TWT_CONSUMER_SECRET,
                accessToken: twitterData.oauth_token,
                accessSecret: twitterData.oauth_token_secret
            });
            if (res.status === 200) {
                dispatch(setTwitterCredential({ ...twitterData, pageDetails: res.data.data }));
            }
        }
    };

    const postData = () => {
        const temp = postDataCountFunc(fbData?.pageDetails?.postData);
        setPostCount(temp??0);
    };

    return (
        <div className='tabBodyTopMargin'>
            <Row align='middle' justify='space-between'>
                <Col xl={24} lg={24} md={24} sm={24} xs={24} className='textAlignEnd dateFont'>
                    <span>Last Updated: {dayjs(new Date()).format('DD MMM YYYY')}</span>
                </Col>
            </Row><br />

            <Row align='top' justify=''>
                <SocialCard
                    icon={<RiUserFollowLine className='cardIcon' />}
                    cardName='Followers'
                    count={twitterData?.pageDetails?.public_metrics?.followers_count}
                />
                <SocialCard 
                    icon={<FaRegImage className='cardIcon' />}
                    cardName='Tweets'
                    count={twitterData?.pageDetails?.public_metrics?.tweet_count}
                />
                <SocialCard 
                    icon={<IoIosHeartDislike className='cardIcon' />}
                    cardName='Likes'
                    count={twitterData?.pageDetails?.public_metrics?.like_count}
                />
                {/* <SocialCard 
                    icon={<MdPreview className='cardIcon' />}
                    cardName='Views'
                    count='0'
                /> */}
                <SocialCard 
                    icon={<SlUserFollowing className='cardIcon' />}
                    cardName='Followings'
                    count={twitterData?.pageDetails?.public_metrics?.following_count}
                />
            </Row>

            <Row align='top' justify='' className='marginCardTop'>
                {/* <SocialCard 
                    icon={<SlUserFollowing className='cardIcon' />}
                    cardName='Followings'
                    count={twitterData?.pageDetails?.public_metrics?.following_count}
                    lastMonthAverage={postCount}
                    className='engageRateCard'
                /> */}
                <EngagementRateCard />
                <AgeRangeCard colCount={8} />
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

export default Twitter;