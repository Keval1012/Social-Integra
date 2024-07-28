import { Card, Col, Row } from 'antd';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { SiPagespeedinsights } from "react-icons/si";

const AgeRangeCard = ({ colCount = null, mRight = false }) => {

    const ageRangeOptions = {
        indexAxis: "x",
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                display: false,
                // ticks: {
                //     format: {
                //         style: 'percent'
                //     }
                // }
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
                position: "bottom",
                display: false
            },
            title: {
                display: false,
                // text: "Age Range"
            }
        }
    };

    const ageRangeData = {
        labels: ['13-17', '18-24', '25-34', '35-44'],
        datasets: [
            {
                // label: "Age Range",
                data: [11, 39, 28, 22],
                borderColor: "#cfcece",
                backgroundColor: "#cfcece",
                // barPercentage: 1,
                barThickness: 35,
                // maxBarThickness: 8,
                // minBarLength: 2,
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
            }
        ]
    };
    
    return (
        <Col xl={colCount??6} lg={colCount??6} md={colCount??6} sm={colCount??6} xs={colCount??6} className={mRight ? 'marginCardAuto' : ''}>
            <Card
                className='card-3 mediumCard ageCard'
                // className='ageRangeCard'
            > 
                <Row><SiPagespeedinsights className='cardIcon' /><h3 className='iconRight'>Age Range</h3></Row><br />
                <Row className='canvasChart'><Bar className='ageRangeWidth' options={ageRangeOptions} data={ageRangeData} /></Row>                       
            </Card>
        </Col>
    );
}

export default AgeRangeCard;