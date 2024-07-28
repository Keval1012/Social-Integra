import { Card, Col, Form, Row } from 'antd';
import React from 'react';
import Selectable from '../Selectable';
import { timePeriodList } from '../../constants';
import { GiEngagementRing } from "react-icons/gi";

const EngagementRateCard = ({ fbPageInsightData, fbEngagementValues }) => {

    const [timePeriodForm] = Form.useForm();

    return (
        <Col xl={8} lg={8} md={8} sm={8} xs={7}>
            <Card className='engageRateCard'>
                <Row justify='space-between'>
                    <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                        <Row><GiEngagementRing className='cardIcon' /><h3 className='iconRight'>Engagement Rate</h3></Row>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                        <Form
                            preserve={false}
                            form={timePeriodForm}
                            // name="addUserForm"
                        >
                            <Selectable
                                name="timePeriod"
                                placeholder='By Time'
                                firstName='name'
                                data={timePeriodList}
                                defaultVal='days_28'
                                handleSelectChange={(period) => {
                                    fbEngagementValues && fbPageInsightData(period);
                                }}
                            />
                        </Form>
                    </Col>
                </Row><br /><br />
                <Row>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <div className='countNumberStyle'><h1 className='percentRate'>
                            {fbEngagementValues?.engagementRate??0}
                        </h1></div>
                    </Col>
                </Row><br />
                <Row align='middle' justify='space-between'>
                    <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <h4>Impressions</h4>
                        <h2>{fbEngagementValues?.impressions??0}</h2>
                    </Col>
                    <div className='divLine'></div>
                    <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <h4>Engagements</h4>
                        <h2>{fbEngagementValues?.engagementUsers??0}</h2>
                    </Col>
                </Row>
            </Card>
        </Col>
    );
}

export default EngagementRateCard;