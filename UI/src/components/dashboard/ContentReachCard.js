import { Card, Col, Row } from 'antd';
import React from 'react';
import { Bar } from 'react-chartjs-2';

const ContentReachCard = () => {

    const contentReachOptions = {
        indexAxis: "y",
        scales: {
            x: {
                stacked: true,
                display: false
            },
            y: {
                stacked: true
            }
        },
        elements: {
            bar: {
                borderWidth: 1
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: "bottom"
            },
            title: {
                display: true,
                // text: "Content Reach"
            }
        }
    };

    const contentReachData = {
        labels: ['Reels', 'Stories', 'Posts'],
        datasets: [
            {
                label: "Followers",
                data: [20, 40, 60],
                borderColor: "#cfcece",
                backgroundColor: "#cfcece"
            },
            {
                label: "Non-followers",
                data: [80, 60, 40],
                borderColor: "black",
                backgroundColor: "black"
            }
        ]
    };
    
    return (
        <Col xl={8} lg={8} md={8} sm={8} xs={8}>
            <Card className='card-3 mediumCard'>
                <Row><h3>Content reach</h3></Row>
                <Row><div className=''>
                    <Bar options={contentReachOptions} data={contentReachData} />
                </div></Row>
            </Card>
        </Col>
    );
}

export default ContentReachCard;