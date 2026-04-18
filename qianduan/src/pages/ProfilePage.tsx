import React, { useState, useEffect } from 'react';
import { Layout, Card, Form, Input, Button, message, Spin, Typography, Divider, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setCurrentUser } from '../store/store';
import { userApi } from '../services/api';
import { checkInApi } from '../services/api';
import { timeUtils, validationUtils } from '../utils';
import { CheckInRecord } from '../types';

const { Content } = Layout;
const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(state => state.user);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        username: currentUser.username,
        email: currentUser.email,
        phone: currentUser.phone
      });
      fetchCheckInRecords();
    }
  }, [currentUser, form]);

  const fetchCheckInRecords = async () => {
    try {
      if (!currentUser) return;
      
      setRecordsLoading(true);
      
      // 模拟获取签到记录
      // const records = await checkInApi.getUserCheckInRecords(currentUser.id);
      
      // 模拟签到记录
      const records: CheckInRecord[] = [
        {
          id: 1,
          userId: currentUser.id,
          username: currentUser.username,
          checkInTime: new Date(Date.now() - 86400000).toISOString(),
          checkOutTime: new Date(Date.now() - 82800000).toISOString(),
          duration: 60,
          status: 'CHECKED_OUT'
        },
        {
          id: 2,
          userId: currentUser.id,
          username: currentUser.username,
          checkInTime: new Date(Date.now() - 172800000).toISOString(),
          checkOutTime: new Date(Date.now() - 169200000).toISOString(),
          duration: 60,
          status: 'CHECKED_OUT'
        },
        {
          id: 3,
          userId: currentUser.id,
          username: currentUser.username,
          checkInTime: new Date(Date.now() - 259200000).toISOString(),
          checkOutTime: new Date(Date.now() - 255600000).toISOString(),
          duration: 60,
          status: 'CHECKED_OUT'
        }
      ];
      
      setCheckInRecords(records);
    } catch (error) {
      console.error('Fetch check in records error:', error);
      message.error('获取签到记录失败');
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleUpdateProfile = async (values: { email: string; phone: string }) => {
    try {
      if (!currentUser) return;
      
      // 验证输入
      if (values.email && !validationUtils.isValidEmail(values.email)) {
        message.error('邮箱格式不正确');
        return;
      }
      if (values.phone && !validationUtils.isValidPhone(values.phone)) {
        message.error('手机号格式不正确');
        return;
      }
      
      setLoading(true);
      
      // 模拟更新用户信息
      // const updatedUser = await userApi.updateUser(currentUser.id, values);
      
      // 模拟更新后的用户数据
      const updatedUser = {
        ...currentUser,
        email: values.email,
        phone: values.phone
      };
      
      dispatch(setCurrentUser(updatedUser));
      message.success('个人信息更新成功');
    } catch (error) {
      console.error('Update profile error:', error);
      message.error('个人信息更新失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5' }}>
      <Card title="个人中心" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="基本信息">
              <Form
                form={form}
                onFinish={handleUpdateProfile}
              >
                <Form.Item
                  name="username"
                  label="用户名"
                >
                  <Input prefix={<UserOutlined />} disabled />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="邮箱"
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="手机号"
                >
                  <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    更新信息
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="个人签到记录">
              <Spin spinning={recordsLoading}>
                {checkInRecords.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Text type="secondary">暂无签到记录</Text>
                  </div>
                ) : (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {checkInRecords.map(record => (
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
              </Spin>
            </Card>
          </Col>
        </Row>
      </Card>
    </Content>
  );
};

export default ProfilePage;
