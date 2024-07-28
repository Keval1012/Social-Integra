import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegImage } from "react-icons/fa6";
import { IoIosHeartDislike } from "react-icons/io";
import { RiUserFollowLine } from "react-icons/ri";
import { MdPreview } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { getLinkedinUserInfo } from '../../API/Api';
import { setLinkedinCredential } from '../../redux/features/userDataSlice';
import SocialCard from './SocialCard';
import EngagementRateCard from './EngagementRateCard';
import AgeRangeCard from './AgeRangeCard';
import ContentReachCard from './ContentReachCard';
import GenderCard from './GenderCard';
import LocationsCard from './LocationsCard';
import { postDataCountFunc } from '../../helper';

const Linkedin = () => {

    // API not available for get user data
    const dispatch = useDispatch();
    const { fbData, linkedinData } = useSelector((state) => state.userData) ?? {};
    const [postCount, setPostCount] = useState(null);

    useEffect(() => {
        fetchLinkedInProfileData();
    }, [JSON.stringify(linkedinData)]);

    useEffect(() => {
        if (fbData?.pageDetails?.postData && !postCount) postData();
    }, [JSON.stringify(fbData)]);

    // Fetch Profile Data
    const fetchLinkedInProfileData = async () => {
        if (linkedinData && !linkedinData?.profileData) {
            const res = await getLinkedinUserInfo({ accessToken: linkedinData?.data?.access_token });
            if (res.status === 200) dispatch(setLinkedinCredential({ ...linkedinData, profileData: res.data }));
        }
    };

    const getTotalLikes = () => {
        let count = 0;
        fbData?.pageDetails?.postData?.forEach(o => {
            count = count + o.likes?.summary?.total_count;
        });
        return count;
    };

    const postData = () => {
        const temp = postDataCountFunc(fbData?.pageDetails?.postData);
        setPostCount(temp??0);
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
                    count={fbData?.pageDetails?.followers_count}
                    lastMonthAverage={postCount}
                />
                <SocialCard 
                    icon={<FaRegImage className='cardIcon' />}
                    cardName='Posts'
                    count={fbData?.pageDetails?.postData?.length}
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
                    count='1.2m'
                    lastMonthAverage={postCount}
                />
            </Row>

            <Row align='top' justify='' className='marginCardTop'>
                <EngagementRateCard />
                <AgeRangeCard />
                <Col xl={11} lg={11} md={11} sm={11} xs={11}></Col>
            </Row>

            <Row align='top' justify='space-between' className='marginCardTop'>
                <ContentReachCard />
                <GenderCard />
                <LocationsCard />
            </Row>
        </div>
    );
}

export default Linkedin;