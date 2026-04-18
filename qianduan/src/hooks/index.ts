import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// 自定义hooks，使用类型化的dispatch和selector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 权限检查hook
export const usePermission = () => {
  const { currentUser } = useAppSelector(state => state.user);
  
  const isAdmin = () => {
    return currentUser?.role === 'ADMIN';
  };
  
  const isAuthenticated = () => {
    return currentUser !== null;
  };
  
  return {
    isAdmin,
    isAuthenticated
  };
};
