import React, { useEffect, useState } from 'react';
import { Layout, Card, Statistic, Row, Col, Button, message } from 'antd';
import { CheckCircleOutlined, QrcodeOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { checkInApi } from '../services/api';
import { timeUtils } from '../utils';

const { Content } = Layout;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector(state => state.user);
  const [todayCount, setTodayCount] = useState(0);
  const [checkInCount, setCheckInCount] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const records = await checkInApi.getUserCheckInRecords();
          
          // 计算今日签到次数
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayRecords = records.filter(record => {
            const checkInDate = new Date(record.checkInTime);
            checkInDate.setHours(0, 0, 0, 0);
            return checkInDate.getTime() === today.getTime();
          });
          setTodayCount(todayRecords.length);
          
          // 计算总签到次数
          setCheckInCount(records.length);
          
          // 计算总时长
          const total = records.reduce((sum, record) => sum + (record.duration || 0), 0);
          setTotalDuration(total);
        }
      } catch (error) {
        console.error('Fetch data error:', error);
      }
    };

    fetchData();
  }, [currentUser]);

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5' }}>
      <Card title="系统概览" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="今日签到"
              value={todayCount}
              prefix={<CheckCircleOutlined />}
              suffix="次"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总签到次数"
              value={checkInCount}
              prefix={<CheckCircleOutlined />}
              suffix="次"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="总签到时长"
              value={totalDuration}
              prefix={<CheckCircleOutlined />}
              suffix="分钟"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="用户角色"
              value={currentUser?.role === 'ADMIN' ? '管理员' : '普通用户'}
              prefix={<TeamOutlined />}
            />
          </Col>
        </Row>
      </Card>

      <Card title="快捷操作" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              style={{ width: '100%' }}
              onClick={() => navigate('/checkin')}
            >
              立即签到
            </Button>
          </Col>
          {currentUser?.role === 'ADMIN' && (
            <>
              <Col span={6}>
                <Button
                  type="default"
                  icon={<QrcodeOutlined />}
                  style={{ width: '100%' }}
                  onClick={() => navigate('/qrcode')}
                >
                  生成二维码
                </Button>
              </Col>
              <Col span={6}>
                <Button
                  type="default"
                  icon={<TeamOutlined />}
                  style={{ width: '100%' }}
                  onClick={() => navigate('/users')}
                >
                  用户管理
                </Button>
              </Col>
              <Col span={6}>
                <Button
                  type="default"
                  icon={<BarChartOutlined />}
                  style={{ width: '100%' }}
                  onClick={() => navigate('/statistics')}
                >
                  数据统计
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Card>

      <Card title="最近签到记录" style={{ marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>暂无签到记录</p>
          <Button type="primary" style={{ marginTop: '16px' }} onClick={() => navigate('/checkin')}>
            立即签到
          </Button>
        </div>
      </Card>
    </Content>
  );
};

export default HomePage;
