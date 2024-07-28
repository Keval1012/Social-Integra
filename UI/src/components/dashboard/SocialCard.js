import { ArrowUpOutlined, RightOutlined } from '@ant-design/icons';
import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Selectable from '../Selectable';
import { timePeriodList } from '../../constants';
import { useSelector } from 'react-redux';

const SocialCard = ({
    icon,
    cardName,
    count,
    lastMonthAverage,
    className='',
    isDropdown = false,
    searchData = [],
    searchField = '',
}) => {

    const { fbData } = useSelector((state) => state.userData) ?? {};
    const [timePeriodForm] = Form.useForm();
    const [engagementRate, setEngagementRate] = useState(0);
    const [views, setViews] = useState(0);
    const [impressionEngageValue, setImpressionEngageValue] = useState(0);

    useEffect(() => {
        pageInsightData('days_28');
    }, []);

    const pageInsightData = async (period) => {
        const temp = searchData?.filter(o => o.period === period);
        const targetEndTime = temp.map(o => o?.values[1]?.end_time);

        const filteredData = temp.map(item => ({
            ...item,
            values: item.values.filter(value => value.end_time === targetEndTime[0])
        }));
        const viewsValue = filteredData.find(item => item.name === searchField)?.values[0]?.value || 0;
        setViews(viewsValue);

        // const impressionsValue = filteredData.find(item => item.name === "page_impressions_unique")?.values[0]?.value || 0;
        // const engagedUsersValue = filteredData.find(item => item.name === "page_engaged_users")?.values[0]?.value || 0;
        // setImpressionEngageValue({ impressionsValue, engagedUsersValue });

        // const result = (engagedUsersValue * 100) / impressionsValue;
        // const engagementRateVal = `${result.toFixed(2)}%`
        // setEngagementRate(engagementRateVal);
    };

    return (
        <Col xl={6} lg={6} md={6} sm={6} xs={6} className='!marginCardAuto'>
            <Card className={className ? className : 'cardStyle'}>
                <Row justify='space-between'>
                    <Col style={{ display: 'flex' }} xl={14} lg={14} md={14} sm={14} xs={14}>
                        {icon}<h3 className='iconRight'>{cardName}</h3>
                    </Col>
                    {isDropdown && <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                        <Form
                            preserve={false}
                            form={timePeriodForm}
                            className='periodDropdownForm'
                        // name="addUserForm"
                        >
                            <Selectable
                                name="timePeriod"
                                placeholder='By Time'
                                firstName='name'
                                data={timePeriodList}
                                defaultVal='days_28'
                                handleSelectChange={(period) => {
                                    pageInsightData(period);
                                }}
                            />
                        </Form>
                    </Col>}
                </Row><br />
                <Row>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div className='countNumberStyle'><h1 className='countFont'>
                            {isDropdown ? views : count}
                        </h1></div>
                    </Col>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div><p className='increasePercent'> <ArrowUpOutlined /> {lastMonthAverage}</p></div>
                        <div><p><RightOutlined /> last month</p></div>
                    </Col>
                </Row>
            </Card>
        </Col>
    );
}

export default SocialCard;