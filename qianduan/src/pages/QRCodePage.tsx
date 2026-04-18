import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, message, Spin, Image, Typography } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';
import { qrCodeApi } from '../services/api';
import { qrCodeUtils } from '../utils';

const { Content } = Layout;
const { Title, Text } = Typography;

const QRCodePage: React.FC = () => {
  const [form] = Form.useForm();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateQRCode = async (values: { userId: number; width: number; height: number }) => {
    try {
      setLoading(true);
      
      // 生成二维码内容
      const content = qrCodeUtils.generateCheckInContent(values.userId);
      
      // 调用API生成二维码
      const blob = await qrCodeApi.generateQRCode(content, values.width, values.height);
      const url = URL.createObjectURL(blob);
      setQrCodeUrl(url);
      
      message.success('二维码生成成功');
    } catch (error) {
      console.error('Generate QR code error:', error);
      message.error('二维码生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5' }}>
      <Card title="生成签到二维码" style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          onFinish={handleGenerateQRCode}
          initialValues={{ userId: 1, width: 300, height: 300 }}
        >
          <Form.Item
            name="userId"
            label="用户ID"
            rules={[{ required: true, message: '请输入用户ID' }]}
          >
            <Input type="number" placeholder="请输入用户ID" />
          </Form.Item>
          <Form.Item
            name="width"
            label="二维码宽度"
            rules={[{ required: true, message: '请输入二维码宽度' }]}
          >
            <Input type="number" placeholder="请输入二维码宽度" />
          </Form.Item>
          <Form.Item
            name="height"
            label="二维码高度"
            rules={[{ required: true, message: '请输入二维码高度' }]}
          >
            <Input type="number" placeholder="请输入二维码高度" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<QrcodeOutlined />}>
              生成二维码
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {qrCodeUrl && (
        <Card title="生成的二维码" style={{ marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Image src={qrCodeUrl} alt="签到二维码" style={{ marginBottom: '24px' }} />
            <div>
              <Text strong>扫描二维码进行签到</Text>
            </div>
          </div>
        </Card>
      )}
    </Content>
  );
};

export default QRCodePage;
