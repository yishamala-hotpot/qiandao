import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Spin, Typography } from 'antd';
import * as echarts from 'echarts';
import { checkInApi } from '../services/api';
import { timeUtils } from '../utils';

const { Content } = Layout;
const { Title } = Typography;

const StatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [checkInData, setCheckInData] = useState<any[]>([]);

  useEffect(() => {
    fetchCheckInData();
  }, []);

  useEffect(() => {
    if (checkInData.length > 0) {
      initCharts();
    }
  }, [checkInData]);

  const fetchCheckInData = async () => {
    try {
      setLoading(true);
      
      // 获取真实签到数据
      const records = await checkInApi.getAllCheckInRecords();
      
      setCheckInData(records);
    } catch (error) {
      console.error('Fetch check in data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const initCharts = () => {
    // 签到率图表
    const checkInRateChart = echarts.init(document.getElementById('checkInRateChart'));
    const checkInRateOption = {
      title: {
        text: '签到率统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '签到状态',
          type: 'pie',
          radius: '50%',
          data: [
            { value: checkInData.length, name: '已签到' },
            { value: 2, name: '未签到' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    checkInRateChart.setOption(checkInRateOption);

    // 用户活跃度图表
    const userActivityChart = echarts.init(document.getElementById('userActivityChart'));
    const userActivityData = checkInData.reduce((acc, record) => {
      if (!acc[record.username]) {
        acc[record.username] = 0;
      }
      acc[record.username]++;
      return acc;
    }, {} as Record<string, number>);
    const userActivityOption = {
      title: {
        text: '用户活跃度统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: Object.keys(userActivityData)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: Object.values(userActivityData),
          type: 'bar'
        }
      ]
    };
    userActivityChart.setOption(userActivityOption);

    // 签到时间分布图表
    const checkInTimeChart = echarts.init(document.getElementById('checkInTimeChart'));
    const checkInTimeData = checkInData.map(record => {
      const hour = new Date(record.checkInTime).getHours();
      return hour;
    }).reduce((acc, hour) => {
      if (!acc[hour]) {
        acc[hour] = 0;
      }
      acc[hour]++;
      return acc;
    }, {} as Record<number, number>);
    const checkInTimeOption = {
      title: {
        text: '签到时间分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: 24 }, (_, i) => i + '时')
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: Array.from({ length: 24 }, (_, i) => checkInTimeData[i] || 0),
          type: 'line',
          smooth: true
        }
      ]
    };
    checkInTimeChart.setOption(checkInTimeOption);

    // 签到时长统计图表
    const checkInDurationChart = echarts.init(document.getElementById('checkInDurationChart'));
    const checkInDurationData = checkInData.reduce((acc, record) => {
      if (!acc[record.username]) {
        acc[record.username] = 0;
      }
      acc[record.username] += record.duration || 0;
      return acc;
    }, {} as Record<string, number>);
    const checkInDurationOption = {
      title: {
        text: '签到时长统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: Object.keys(checkInDurationData)
      },
      yAxis: {
        type: 'value',
        name: '分钟'
      },
      series: [
        {
          data: Object.values(checkInDurationData),
          type: 'bar'
        }
      ]
    };
    checkInDurationChart.setOption(checkInDurationOption);

    // 响应式处理
    window.addEventListener('resize', () => {
      checkInRateChart.resize();
      userActivityChart.resize();
      checkInTimeChart.resize();
      checkInDurationChart.resize();
    });
  };

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5' }}>
      <Card title="数据统计" style={{ marginBottom: '24px' }}>
        <Spin spinning={loading}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Card title="签到率统计" style={{ marginBottom: '16px' }}>
                <div id="checkInRateChart" style={{ width: '100%', height: '300px' }}></div>
              </Card>
              <Card title="用户活跃度统计" style={{ marginBottom: '16px' }}>
                <div id="userActivityChart" style={{ width: '100%', height: '300px' }}></div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="签到时间分布" style={{ marginBottom: '16px' }}>
                <div id="checkInTimeChart" style={{ width: '100%', height: '300px' }}></div>
              </Card>
              <Card title="签到时长统计" style={{ marginBottom: '16px' }}>
                <div id="checkInDurationChart" style={{ width: '100%', height: '300px' }}></div>
              </Card>
            </Col>
          </Row>
        </Spin>
      </Card>
    </Content>
  );
};

export default StatisticsPage;
