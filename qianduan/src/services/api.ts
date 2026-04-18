import axios from 'axios';
import { User, UserVO, CreateUserDTO, UpdateUserDTO, CheckInRecord, QRCodeConfig, LoginRequest, LoginResponse } from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // 解析存储的token（可能是JSON字符串）
      let actualToken = token;
      try {
        const parsed = JSON.parse(token);
        // 如果解析后的是对象，直接使用其值
        if (typeof parsed === 'string') {
          actualToken = parsed;
        }
      } catch (e) {
        // token不是JSON，直接使用
      }
      config.headers.Authorization = `Bearer ${actualToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 用户相关API
export const userApi = {
  // 登录
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return api.post('/auth/login', data);
  },
  
  // 注册
  register: (data: CreateUserDTO): Promise<UserVO> => {
    return api.post('/users', data);
  },
  
  // 获取所有用户
  getAllUsers: (): Promise<UserVO[]> => {
    return api.get('/users');
  },
  
  // 根据ID获取用户
  getUserById: (id: number): Promise<UserVO> => {
    return api.get(`/users/${id}`);
  },
  
  // 根据用户名获取用户
  getUserByUsername: (username: string): Promise<UserVO> => {
    return api.get(`/users/search?username=${username}`);
  },
  
  // 更新用户
  updateUser: (id: number, data: UpdateUserDTO): Promise<UserVO> => {
    return api.put(`/users/${id}`, data);
  },
  
  // 删除用户
  deleteUser: (id: number): Promise<void> => {
    return api.delete(`/users/${id}`);
  }
};

// 二维码相关API
export const qrCodeApi = {
  // 生成二维码
  generateQRCode: (content: string, width: number = 300, height: number = 300): Promise<Blob> => {
    return api.get(`/qrcode/generate?content=${encodeURIComponent(content)}&width=${width}&height=${height}`, {
      responseType: 'blob'
    });
  }
};

// 签到相关API
export const checkInApi = {
  // 开始签到
  startCheckIn: (): Promise<CheckInRecord> => {
    return api.post('/checkin/start');
  },
  
  // 结束签到
  endCheckIn: (recordId: number): Promise<CheckInRecord> => {
    console.log('End check-in for record ID:', recordId);
    return api.post(`/checkin/end/${recordId}`);
  },
  
  // 获取当前签到记录
  getCurrentCheckInRecord: (): Promise<CheckInRecord> => {
    return api.get('/checkin/current');
  },
  
  // 获取用户签到记录
  getUserCheckInRecords: (): Promise<CheckInRecord[]> => {
    return api.get('/checkin/user');
  },
  
  // 获取用户指定时间范围的签到记录
  getUserCheckInRecordsByTimeRange: (startTime: string, endTime: string): Promise<CheckInRecord[]> => {
    return api.get(`/checkin/user/range?startTime=${startTime}&endTime=${endTime}`);
  },
  
  // 获取所有签到记录
  getAllCheckInRecords: (): Promise<CheckInRecord[]> => {
    return api.get('/checkin/all');
  },
  
  // 获取用户签到统计
  getUserCheckInStats: (): Promise<{count: number, duration: number}> => {
    return api.get('/checkin/stats/user');
  }
};

export default api;
