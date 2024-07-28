import { Card, Col, Row } from 'antd';
import React from 'react';

const GenderCard = () => {
    return (
        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
            <Card className='card-3 mediumCard'>
                <Row><h3>Gender</h3></Row><br /><br />
                <Row><div className=''>
                    <Row><h1>Female - N/A</h1></Row>
                    <Row><h1>Male - N/A</h1></Row>
                    <Row><h1>Other - N/A</h1></Row>
                </div></Row>
            </Card>
        </Col>
    );
}

export default GenderCard;