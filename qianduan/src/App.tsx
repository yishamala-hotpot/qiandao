import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import Navbar from './components/Navbar';
import FooterComponent from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CheckInPage from './pages/CheckInPage';
import QRCodePage from './pages/QRCodePage';
import UserManagementPage from './pages/UserManagementPage';
import StatisticsPage from './pages/StatisticsPage';
import ProfilePage from './pages/ProfilePage';
import { useAppSelector, useAppDispatch } from './hooks';
import { setCurrentUser } from './store/store';
import { storageUtils } from './utils';
import './App.css';

const { Content } = Layout;

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.user);

  // 初始化时检查本地存储中的用户信息
  useEffect(() => {
    const token = storageUtils.get('token', null);
    if (token) {
      // 确保token是字符串
      const tokenString = typeof token === 'string' ? token : JSON.stringify(token);
      // 从token解析用户信息（JWT payload）
      try {
        const tokenParts = tokenString.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const user = {
            id: payload.id,
            username: payload.username,
            email: '',
            phone: '',
            status: 'ACTIVE',
            role: payload.role,
            createTime: new Date().toISOString()
          };
          dispatch(setCurrentUser(user));
        }
      } catch (error) {
        console.error('Failed to parse token:', error);
        storageUtils.remove('token');
      }
    }
  }, [dispatch]);

  // 受保护的路由组件
  const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
    const { currentUser, isAuthenticated } = useAppSelector(state => state.user);
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    if (adminOnly && currentUser?.role !== 'ADMIN') {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <Router>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
          components: {
            Layout: {
              headerHeight: 64,
            },
          },
        }}
      >
        <Layout style={{ minHeight: '100vh' }}>
          <Navbar />
          <Content style={{ padding: '24px', background: '#f0f2f5' }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/checkin" element={<ProtectedRoute><CheckInPage /></ProtectedRoute>} />
              <Route path="/qrcode" element={<ProtectedRoute adminOnly><QRCodePage /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute adminOnly><UserManagementPage /></ProtectedRoute>} />
              <Route path="/statistics" element={<ProtectedRoute adminOnly><StatisticsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Content>
          <FooterComponent />
        </Layout>
      </ConfigProvider>
    </Router>
  );
}

export default App;
