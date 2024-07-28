import { Card, Col, Row } from 'antd';
import React from 'react';

const LocationsCard = () => {
    return (
        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
            <Card className='card-3 mediumCard'>
                <Row><h3>Locations</h3></Row><br /><br />
                <Row><div className='locationStyle'>
                    <Row align='middle' justify='space-between'>
                        <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                            <h2>China</h2>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8} className='textAlignEnd'>
                            <h2>N/A</h2>
                        </Col>
                    </Row>
                    <Row align='middle' justify='space-between'>
                        <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                            <h2>Vietnam</h2>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8} className='textAlignEnd'>
                            <h2>N/A</h2>
                        </Col>
                    </Row>
                    <Row align='middle' justify='space-between'>
                        <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                            <h2>Australia</h2>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8} className='textAlignEnd'>
                            <h2>N/A</h2>
                        </Col>
                    </Row>
                    <Row align='middle' justify='space-between'>
                        <Col xl={16} lg={16} md={16} sm={16} xs={16}>
                            <h2>Indonesia</h2>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={8} xs={8} className='textAlignEnd'>
                            <h2>N/A</h2>
                        </Col>
                    </Row>
                </div></Row>
            </Card>
        </Col>
    );
}

export default LocationsCard;