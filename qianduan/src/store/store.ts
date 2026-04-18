import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserVO, CheckInRecord, UserRole } from '../types';

// 用户状态切片
const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null as UserVO | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null
  },
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserVO>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// 签到状态切片
const checkInSlice = createSlice({
  name: 'checkIn',
  initialState: {
    records: [] as CheckInRecord[],
    currentCheckIn: null as CheckInRecord | null,
    loading: false,
    error: null as string | null
  },
  reducers: {
    setRecords: (state, action: PayloadAction<CheckInRecord[]>) => {
      state.records = action.payload;
      state.error = null;
    },
    setCurrentCheckIn: (state, action: PayloadAction<CheckInRecord | null>) => {
      state.currentCheckIn = action.payload;
    },
    addRecord: (state, action: PayloadAction<CheckInRecord>) => {
      state.records.unshift(action.payload);
    },
    updateRecord: (state, action: PayloadAction<CheckInRecord>) => {
      const index = state.records.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// 用户列表状态切片
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [] as UserVO[],
    loading: false,
    error: null as string | null
  },
  reducers: {
    setUsers: (state, action: PayloadAction<UserVO[]>) => {
      state.list = action.payload;
      state.error = null;
    },
    addUser: (state, action: PayloadAction<UserVO>) => {
      state.list.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<UserVO>) => {
      const index = state.list.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(user => user.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// 导出action creators
export const { setCurrentUser, clearCurrentUser, setLoading: setUserLoading, setError: setUserError } = userSlice.actions;
export const { setRecords, setCurrentCheckIn, addRecord, updateRecord, setLoading: setCheckInLoading, setError: setCheckInError } = checkInSlice.actions;
export const { setUsers, addUser, updateUser, deleteUser, setLoading: setUsersLoading, setError: setUsersError } = usersSlice.actions;

// 配置store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    checkIn: checkInSlice.reducer,
    users: usersSlice.reducer
  }
});

// 导出store和类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
