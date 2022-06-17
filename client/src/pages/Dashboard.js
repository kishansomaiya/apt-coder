import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Line, Radar } from '@ant-design/plots';


const Dashboard = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);


  useEffect(() => {
    asyncFetch();
    asyncFetch2();
  }, []);

  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/e00d52f4-2fa6-47ee-a0d7-105dd95bde20.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

  const asyncFetch2 = () => {
    fetch('https://gw.alipayobjects.com/os/antfincdn/svFjSfJkYy/radar.json')
      .then((response) => response.json())
      .then((json) => setData2(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

  const config = {
    data,
    xField: 'year',
    yField: 'gdp',
    seriesField: 'name',
    yAxis: {
      label: {
        formatter: (v) => `${(v / 10e8).toFixed(1)} B`,
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };

  const config2 = {
    data2,
    xField: 'item',
    yField: 'score',
    seriesField: 'user',
    meta: {
      score: {
        alias: '分数',
        min: 0,
        max: 80,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    // 开启辅助点
    point: {
      size: 10,
    },
  };

  return (
    <>
  <Line {...config} />
  {/* <Radar {...config2} /> */}
  <Link to='/employees'>Employees</Link>
  </>
  );
};

export default Dashboard;