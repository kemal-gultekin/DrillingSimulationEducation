import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { authRepository, UserAccount } from '../repositories';

export const DEMO_PROFILES: UserProfile[] = [
  {
    id: 'std-1',
    fullName: 'Kemal Gültekin',
    role: 'student',
    studentNumber: 'PETRO-2024-041',
    email: 'kemal.g@petrosim.edu',
    username: 'kemal.gultekin',
    classCode: 'PET101'
  },
  {
    id: 'std-2',
    fullName: 'Zeynep Kaya',
    role: 'student',
    studentNumber: 'PETRO-2024-019',
    email: 'zeynep.k@petrosim.edu',
    username: 'zeynep.kaya',
    classCode: 'PET101'
  },
  {
    id: 'inst-1',
    fullName: 'Prof. Dr. Ahmet Yılmaz',
    role: 'instructor',
    title: 'Sondaj ve Kuyu Mühendisliği Ana Bilim Dalı',
    email: 'ahmet.yilmaz@petrosim.edu',
    username: 'ahmet.yilmaz'
  }
];

function accountToProfile(acc: UserAccount): UserProfile {
  return {
    id: acc.id,
    fullName: acc.fullName,
    role: acc.role,
    studentNumber: acc.studentNumber,
    title: acc.title,
    email: acc.email,
    username: acc.username,
    classCode: acc.classCode,
    createdAt: acc.createdAt
  };
}

interface AuthContextValue {
  currentUser: UserProfile;
  rawUserAccount: UserAccount | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  loginWithCredentials: (username: string, password: string) => Promise<UserAccount>;
  registerInstructorAccount: (data: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    title?: string;
  }) => Promise<UserAccount>;
  registerStudentAccount: (data: {
    fullName: string;
    username: string;
    password: string;
    classCode: string;
    studentNumber?: string;
  }) => Promise<UserAccount>;
  login: (fullName: string, role: UserRole, studentNumber?: string, title?: string) => void;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  selectDemoUser: (profile: UserProfile) => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_PROFILES[0]);
  const [rawUserAccount, setRawUserAccount] = useState<UserAccount | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Initialize session from repository on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await authRepository.migrateLegacyUserData();
        const stored = await authRepository.getCurrentUser();
        if (isMounted) {
          if (stored) {
            setRawUserAccount(stored);
            setCurrentUser(accountToProfile(stored));
            setIsAuthenticated(true);
          } else {
            // Check legacy storage
            const legacy = localStorage.getItem('petrosim_auth_user');
            if (legacy) {
              const parsed = JSON.parse(legacy);
              // Attempt to log in or map to seed
              try {
                const auto = await authRepository.login(
                  parsed.role === 'instructor' ? 'ahmet.yilmaz' : 'kemal.gultekin',
                  'Petro2026!'
                );
                setRawUserAccount(auto);
                setCurrentUser(accountToProfile(auto));
                setIsAuthenticated(true);
              } catch {
                setIsAuthenticated(false);
              }
            } else {
              // Default to authenticated demo student for seamless experience,
              // or let session keep last login
              try {
                const def = await authRepository.login('kemal.gultekin', 'Petro2026!');
                setRawUserAccount(def);
                setCurrentUser(accountToProfile(def));
                setIsAuthenticated(true);
              } catch {
                setIsAuthenticated(true);
              }
            }
          }
        }
      } catch (e) {
        console.error('Session init error:', e);
      } finally {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginWithCredentials = useCallback(async (username: string, password: string): Promise<UserAccount> => {
    const acc = await authRepository.login(username, password);
    setRawUserAccount(acc);
    setCurrentUser(accountToProfile(acc));
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    return acc;
  }, []);

  const registerInstructorAccount = useCallback(async (data: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    title?: string;
  }): Promise<UserAccount> => {
    const acc = await authRepository.registerInstructor(data);
    setRawUserAccount(acc);
    setCurrentUser(accountToProfile(acc));
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    return acc;
  }, []);

  const registerStudentAccount = useCallback(async (data: {
    fullName: string;
    username: string;
    password: string;
    classCode: string;
    studentNumber?: string;
  }): Promise<UserAccount> => {
    const acc = await authRepository.registerStudent(data);
    setRawUserAccount(acc);
    setCurrentUser(accountToProfile(acc));
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    return acc;
  }, []);

  const logout = useCallback(async () => {
    await authRepository.logout();
    setRawUserAccount(null);
    setIsAuthenticated(false);
    setIsLoginModalOpen(true);
  }, []);

  const selectDemoUser = useCallback(async (profile: UserProfile) => {
    try {
      const username = profile.role === 'instructor' ? 'ahmet.yilmaz' : (profile.id === 'std-2' ? 'zeynep.kaya' : 'kemal.gultekin');
      const acc = await authRepository.login(username, 'Petro2026!');
      setRawUserAccount(acc);
      setCurrentUser(accountToProfile(acc));
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
    } catch {
      // Fallback
      setCurrentUser(profile);
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
    }
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    if (newRole === currentUser.role) return;
    const targetProfile = DEMO_PROFILES.find((p) => p.role === newRole) || (newRole === 'instructor' ? DEMO_PROFILES[2] : DEMO_PROFILES[0]);
    selectDemoUser(targetProfile);
  }, [currentUser.role, selectDemoUser]);

  // Legacy fallback login
  const login = useCallback((fullName: string, role: UserRole, studentNumber?: string, title?: string) => {
    const demo = DEMO_PROFILES.find((p) => p.role === role) || (role === 'instructor' ? DEMO_PROFILES[2] : DEMO_PROFILES[0]);
    selectDemoUser({
      ...demo,
      fullName: fullName.trim() || demo.fullName,
      studentNumber: studentNumber || demo.studentNumber,
      title: title || demo.title
    });
  }, [selectDemoUser]);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        rawUserAccount,
        isAuthenticated,
        isLoadingSession,
        loginWithCredentials,
        registerInstructorAccount,
        registerStudentAccount,
        login,
        logout,
        switchRole,
        selectDemoUser,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
