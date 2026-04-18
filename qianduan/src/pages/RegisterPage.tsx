import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Input, Button, message, Spin } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { userApi } from '../services/api';
import { validationUtils } from '../utils';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: { username: string; password: string; email: string; phone: string }) => {
    try {
      setLoading(true);
      
      // 验证输入
      if (!validationUtils.isValidUsername(values.username)) {
        message.error('用户名长度应为3-20个字符');
        return;
      }
      if (!validationUtils.isStrongPassword(values.password)) {
        message.error('密码长度至少为6个字符');
        return;
      }
      if (values.email && !validationUtils.isValidEmail(values.email)) {
        message.error('邮箱格式不正确');
        return;
      }
      if (values.phone && !validationUtils.isValidPhone(values.phone)) {
        message.error('手机号格式不正确');
        return;
      }
      
      // 调用后端API注册
      await userApi.register(values);
      
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);
      message.error('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f0f2f5' }}>
      <Card title="用户注册" style={{ width: 400 }}>
        <Form
          name="register"
          onFinish={handleRegister}
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
          <Form.Item
            name="email"
            rules={[{ type: 'email', message: '邮箱格式不正确' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱（选填）" />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="手机号（选填）" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              注册
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to="/login">
              已有账号？立即登录
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
