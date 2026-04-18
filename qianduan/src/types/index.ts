// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED'
}

// 用户角色枚举
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

// 用户实体类型
export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  status: UserStatus;
  role: UserRole;
  createTime: string;
  updateTime: string;
}

// 用户DTO类型
export interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
  phone: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  email: string;
  phone: string;
  status: UserStatus;
  role?: UserRole;
}

// 用户VO类型
export interface UserVO {
  id: number;
  username: string;
  email: string;
  phone: string;
  status: UserStatus;
  role: UserRole;
  createTime: string;
}

// 签到记录类型
export interface CheckInRecord {
  id: number;
  userId: number;
  username: string;
  checkInTime: string;
  checkOutTime: string | null;
  duration: number | null; // 单位：分钟
  status: 'CHECKED_IN' | 'CHECKED_OUT';
}

// 二维码配置类型
export interface QRCodeConfig {
  content: string;
  width: number;
  height: number;
  expiresAt: string | null;
}

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  user: UserVO;
}

// 应用状态类型
export interface AppState {
  user: {
    currentUser: UserVO | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  };
  checkIn: {
    records: CheckInRecord[];
    currentCheckIn: CheckInRecord | null;
    loading: boolean;
    error: string | null;
  };
  users: {
    list: UserVO[];
    loading: boolean;
    error: string | null;
  };
}
