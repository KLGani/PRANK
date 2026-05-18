import { User, HistoryEntry, StudentPerformance } from '../types';

const STORAGE_KEYS = {
  USERS: 'edupredict_users',
  CURRENT_USER: 'edupredict_current_user',
  HISTORY: 'edupredict_history',
  STUDENT_DATA: 'edupredict_student_data',
};

export const storage = {
  // User Management
  saveUser: (user: User, password: string) => {
    const users = storage.getUsers();
    users.push({ ...user, password });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getUsers: (): Array<User & { password: string }> => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  findUser: (email: string, password: string) => {
    const users = storage.getUsers();
    return users.find(u => u.email === email && u.password === password);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // History Management
  saveHistory: (entry: HistoryEntry) => {
    const history = storage.getHistory();
    history.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  getHistory: (): HistoryEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },

  getHistoryByStudent: (studentId: string): HistoryEntry[] => {
    return storage.getHistory().filter(h => h.studentId === studentId);
  },

  // Student Data Management
  saveStudentData: (data: StudentPerformance) => {
    const allData = storage.getAllStudentData();
    const existing = allData.findIndex(d => d.studentId === data.studentId && d.timestamp === data.timestamp);
    if (existing >= 0) {
      allData[existing] = data;
    } else {
      allData.push(data);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENT_DATA, JSON.stringify(allData));
  },

  saveMultipleStudentData: (dataArray: StudentPerformance[]) => {
    const allData = storage.getAllStudentData();
    dataArray.forEach(data => {
      const existing = allData.findIndex(d => d.studentId === data.studentId && d.timestamp === data.timestamp);
      if (existing >= 0) {
        allData[existing] = data;
      } else {
        allData.push(data);
      }
    });
    localStorage.setItem(STORAGE_KEYS.STUDENT_DATA, JSON.stringify(allData));
  },

  getAllStudentData: (): StudentPerformance[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENT_DATA);
    return data ? JSON.parse(data) : [];
  },

  getStudentDataById: (studentId: string): StudentPerformance[] => {
    return storage.getAllStudentData().filter(d => d.studentId === studentId);
  },
};
