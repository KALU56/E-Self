// // context/AuthContext.tsx
// 'use client';

// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface User {
//   role: 'student' | 'instructor';
//   email: string;
//   // Add other user properties as needed
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, role: 'student' | 'instructor') => void; // Modify login function
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   const login = (email: string, role: 'student' | 'instructor') => { // Modify login function
//     setUser({ email, role });
//     // Add logic to store tokens, etc.
//   };

//   const logout = () => {
//     setUser(null);
//     // Add logic to clear tokens, etc.
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within an AuthProvider');
//   return context;
// };




// context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR';
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, role: 'STUDENT' | 'INSTRUCTOR', accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client
    const storedAccessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const storedRefreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (storedAccessToken && storedRefreshToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.clear(); // Clear invalid data
      }
    }
  }, []);

  const login = (email: string, role: 'STUDENT' | 'INSTRUCTOR', accessToken: string, refreshToken: string) => {
    const user = { email, role };
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};