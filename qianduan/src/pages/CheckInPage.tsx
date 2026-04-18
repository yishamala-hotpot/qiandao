import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, message, Spin, Typography, Divider } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setCurrentCheckIn, addRecord, updateRecord, setCheckInLoading, setCheckInError } from '../store/store';
import { checkInApi } from '../services/api';
import { timeUtils } from '../utils';

const { Content } = Layout;
const { Title, Text } = Typography;

const CheckInPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(state => state.user);
  const { currentCheckIn, records } = useAppSelector(state => state.checkIn);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 组件加载时获取当前签到状态和签到记录
  useEffect(() => {
    const fetchCheckInData = async () => {
      if (currentUser) {
        try {
          // 获取当前签到记录
          const currentRecord = await checkInApi.getCurrentCheckInRecord();
          // 注意：如果没有当前签到记录，API会返回204 No Content，这会导致currentRecord为undefined
          dispatch(setCurrentCheckIn(currentRecord || null));
          
          // 获取用户签到记录
          const userRecords = await checkInApi.getUserCheckInRecords();
          userRecords.forEach(record => dispatch(addRecord(record)));
        } catch (error) {
          console.error('Fetch check-in data error:', error);
          // 出错时也设置为null
          dispatch(setCurrentCheckIn(null));
        }
      }
    };

    fetchCheckInData();
  }, [currentUser, dispatch]);

  useEffect(() => {
    let interval: number;
    if (currentCheckIn && currentCheckIn.status === 'CHECKED_IN') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentCheckIn]);

  const handleCheckIn = async () => {
    try {
      if (!currentUser) {
        message.error('请先登录');
        return;
      }

      setLoading(true);
      dispatch(setCheckInLoading(true));
      dispatch(setCheckInError(null));

      const record = await checkInApi.startCheckIn();
      dispatch(setCurrentCheckIn(record));
      dispatch(addRecord(record));
      message.success('签到成功');
    } catch (error) {
      console.error('Check in error:', error);
      dispatch(setCheckInError('签到失败，请稍后重试'));
      message.error('签到失败，请稍后重试');
    } finally {
      setLoading(false);
      dispatch(setCheckInLoading(false));
    }
  };

  const handleCheckOut = async () => {
    try {
      if (!currentCheckIn) {
        message.error('请先签到');
        return;
      }

      console.log('Current check-in:', currentCheckIn);
      console.log('Check-in ID:', currentCheckIn.id);

      setLoading(true);
      dispatch(setCheckInLoading(true));
      dispatch(setCheckInError(null));

      const record = await checkInApi.endCheckIn(currentCheckIn.id);
      console.log('Check-out result:', record);
      dispatch(setCurrentCheckIn(null));
      dispatch(updateRecord(record));
      message.success('签退成功');
      setElapsedTime(0);
    } catch (error) {
      console.error('Check out error:', error);
      // 打印详细的错误信息
      if (error.response) {
        console.error('Error response:', error.response);
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      dispatch(setCheckInError('签退失败，请稍后重试'));
      message.error('签退失败，请稍后重试');
    } finally {
      setLoading(false);
      dispatch(setCheckInLoading(false));
    }
  };

  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5' }}>
      <Card title="签到管理" style={{ marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          {!currentCheckIn ? (
            <>
              <CheckCircleOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '24px' }} />
              <Title level={4}>准备签到</Title>
              <Text type="secondary">点击下方按钮开始签到</Text>
              <Button
                type="primary"
                size="large"
                style={{ marginTop: '24px' }}
                loading={loading}
                onClick={handleCheckIn}
              >
                开始签到
              </Button>
            </>
          ) : (
            <>
              <ClockCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }} />
              <Title level={4}>签到中</Title>
              <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '24px 0' }}>
                {formatElapsedTime(elapsedTime)}
              </div>
              <Text type="secondary">签到时间: {timeUtils.format(currentCheckIn.checkInTime)}</Text>
              <Button
                danger
                size="large"
                style={{ marginTop: '24px' }}
                loading={loading}
                onClick={handleCheckOut}
              >
                结束签到
              </Button>
            </>
          )}
        </div>
      </Card>

      <Card title="签到记录" style={{ marginBottom: '24px' }}>
        {records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">暂无签到记录</Text>
          </div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {records.map(record => (
              <div key={record.id} style={{ marginBottom: '16px', padding: '16px', border: '1px solid #e8e8e8', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>签到时间: {timeUtils.format(record.checkInTime)}</Text>
                  <Text type={record.status === 'CHECKED_OUT' ? 'success' : 'warning'}>
                    {record.status === 'CHECKED_OUT' ? '已签退' : '签到中'}
                  </Text>
                </div>
                {record.checkOutTime && (
                  <>
                    <Divider style={{ margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text>签退时间: {timeUtils.format(record.checkOutTime)}</Text>
                      <Text strong>时长: {timeUtils.formatDuration(record.duration || 0)}</Text>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </Content>
  );
};

export default CheckInPage;
