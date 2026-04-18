import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Button, Modal, Form, Input, Select, message, Spin } from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../hooks';
import { setUsers, addUser, updateUser, deleteUser, setUsersLoading, setUsersError } from '../store/store';
import { userApi } from '../services/api';
import { UserVO, UserStatus, UserRole } from '../types';
import { validationUtils } from '../utils';

const { Content } = Layout;
const { Option } = Select;

const UserManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list: users, loading: usersLoading } = useAppSelector(state => state.users);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserVO | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      dispatch(setUsersLoading(true));
      dispatch(setUsersError(null));
      
      // 获取真实用户列表
      const usersList = await userApi.getAllUsers();
      
      dispatch(setUsers(usersList));
    } catch (error) {
      console.error('Fetch users error:', error);
      dispatch(setUsersError('获取用户列表失败'));
      message.error('获取用户列表失败');
    } finally {
      dispatch(setUsersLoading(false));
    }
  };

  const handleAddUser = async (values: { username: string; password: string; email: string; phone: string; role: UserRole }) => {
    try {
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
      
      // 添加用户
      const newUser = await userApi.register(values);
      
      dispatch(addUser(newUser));
      setIsAddModalVisible(false);
      addForm.resetFields();
      message.success('添加用户成功');
    } catch (error) {
      console.error('Add user error:', error);
      message.error('添加用户失败');
    }
  };

  const handleEditUser = async (values: { email: string; phone: string; status: UserStatus; role: UserRole }) => {
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
      
      // 更新用户
      const updatedUser = await userApi.updateUser(currentUser.id, values);
      
      dispatch(updateUser(updatedUser));
      setIsEditModalVisible(false);
      editForm.resetFields();
      message.success('更新用户成功');
    } catch (error) {
      console.error('Edit user error:', error);
      message.error('更新用户失败');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      // 删除用户
      await userApi.deleteUser(userId);
      
      dispatch(deleteUser(userId));
      message.success('删除用户成功');
    } catch (error) {
      console.error('Delete user error:', error);
      message.error('删除用户失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => {
        const statusMap = {
          ACTIVE: '活跃',
          INACTIVE: '非活跃',
          LOCKED: '锁定'
        };
        return statusMap[status];
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => {
        return role === 'ADMIN' ? '管理员' : '普通用户';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: UserVO) => (
        <div>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentUser(record);
              editForm.setFieldsValue({
                email: record.email,
                phone: record.phone,
                status: record.status,
                role: record.role
              });
              setIsEditModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5' }}>
      <Card
        title="用户管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalVisible(true)}>
            添加用户
          </Button>
        }
        style={{ marginBottom: '24px' }}
      >
        <Spin spinning={usersLoading}>
          <Table columns={columns} dataSource={users} rowKey="id" />
        </Spin>
      </Card>

      {/* 添加用户模态框 */}
      <Modal
        title="添加用户"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form
          form={addForm}
          onFinish={handleAddUser}
          initialValues={{ role: 'USER' }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="ADMIN">管理员</Option>
              <Option value="USER">普通用户</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              确定
            </Button>
            <Button onClick={() => setIsAddModalVisible(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          onFinish={handleEditUser}
        >
          <Form.Item
            name="email"
            label="邮箱"
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="ACTIVE">活跃</Option>
              <Option value="INACTIVE">非活跃</Option>
              <Option value="LOCKED">锁定</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="ADMIN">管理员</Option>
              <Option value="USER">普通用户</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              确定
            </Button>
            <Button onClick={() => setIsEditModalVisible(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default UserManagementPage;
