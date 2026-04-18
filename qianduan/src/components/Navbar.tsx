import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Button } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, CheckCircleOutlined, QrcodeOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../hooks';
import { clearCurrentUser } from '../store/store';
import { storageUtils } from '../utils';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, isAuthenticated } = useAppSelector(state => state.user);

  const handleLogout = () => {
    storageUtils.remove('token');
    dispatch(clearCurrentUser());
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'checkin',
      icon: <CheckCircleOutlined />,
      label: <Link to="/checkin">签到</Link>,
    },
  ];

  // 管理员菜单
  if (currentUser?.role === 'ADMIN') {
    menuItems.push(
      {
        key: 'qrcode',
        icon: <QrcodeOutlined />,
        label: <Link to="/qrcode">生成二维码</Link>,
      },
      {
        key: 'users',
        icon: <TeamOutlined />,
        label: <Link to="/users">用户管理</Link>,
      },
      {
        key: 'statistics',
        icon: <BarChartOutlined />,
        label: <Link to="/statistics">数据统计</Link>,
      }
    );
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">个人中心</Link>
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout
    }
  ];

  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1890ff' }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginRight: '30px' }}>
          签到系统
        </div>
        <Menu
          mode="horizontal"
          items={menuItems}
          style={{ background: 'transparent', borderBottom: 'none', flex: 1 }}
          theme="dark"
          responsive
          overflow={{
            menu: 'auto',
          }}
        />
      </div>
      <div>
        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['hover']}>
            <Button type="text" icon={<UserOutlined />} style={{ color: 'white' }}>
              {currentUser?.username}
            </Button>
          </Dropdown>
        ) : (
          <>
            <Link to="/login">
              <Button type="text" style={{ color: 'white', marginRight: '10px' }}>
                登录
              </Button>
            </Link>
            <Link to="/register">
              <Button type="primary" ghost style={{ color: 'white', borderColor: 'white' }}>
                注册
              </Button>
            </Link>
          </>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
