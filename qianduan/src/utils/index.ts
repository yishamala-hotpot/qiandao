import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

// 扩展dayjs插件
dayjs.extend(duration);
dayjs.extend(relativeTime);

// 时间处理工具
export const timeUtils = {
  // 格式化时间
  format: (date: string | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
    return dayjs(date).format(format);
  },
  
  // 计算时长（分钟）
  calculateDuration: (startTime: string | Date, endTime: string | Date): number => {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    return end.diff(start, 'minute');
  },
  
  // 格式化时长
  formatDuration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  },
  
  // 获取相对时间
  getRelativeTime: (date: string | Date): string => {
    return dayjs(date).fromNow();
  }
};

// 本地存储工具
export const storageUtils = {
  // 设置本地存储
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  
  // 获取本地存储
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error('Error getting localStorage:', error);
      return defaultValue;
    }
  },
  
  // 删除本地存储
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage:', error);
    }
  },
  
  // 清除所有本地存储
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// 验证工具
export const validationUtils = {
  // 验证邮箱
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // 验证手机号
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },
  
  // 验证密码强度
  isStrongPassword: (password: string): boolean => {
    return password.length >= 6;
  },
  
  // 验证用户名
  isValidUsername: (username: string): boolean => {
    return username.length >= 3 && username.length <= 20;
  }
};

// 二维码工具
export const qrCodeUtils = {
  // 生成签到二维码内容
  generateCheckInContent: (userId: number): string => {
    return `http://localhost:5173/checkin?userId=${userId}`;
  },
  
  // 解析二维码内容
  parseCheckInContent: (content: string): { userId: number } | null => {
    try {
      const url = new URL(content);
      const userId = url.searchParams.get('userId');
      if (userId) {
        return { userId: parseInt(userId, 10) };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
};
