import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Card, Form, Input, Button, message, Spin } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setCurrentUser, setUserLoading, setUserError } from '../store/store';
import { userApi } from '../services/api';
import { storageUtils } from '../utils';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(false);

  // 如果已经登录，跳转到首页
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      dispatch(setUserLoading(true));
      dispatch(setUserError(null));
      
      // 调用后端API登录
      const response = await userApi.login(values);
      const { token, user } = response;
      
      // 存储token和用户信息
      storageUtils.set('token', token);
      dispatch(setCurrentUser(user));
      
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      dispatch(setUserError('登录失败，请检查用户名和密码'));
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
      dispatch(setUserLoading(false));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f0f2f5' }}>
      <Card title="用户登录" style={{ width: 400 }}>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              登录
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to="/register">
              还没有账号？立即注册
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
