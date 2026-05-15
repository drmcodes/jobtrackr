import { createContext, useContext, useState, ReactNode } from "react";

interface AuthState {
  accessToken: string | null;
  user: { id: string; name: string; email: string } | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (
    accessToken: string,
    user: { id: string; name: string; email: string },
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    user: null,
    isAuthenticated: false,
  });

  const login = (
    accessToken: string,
    user: { id: string; name: string; email: string },
  ) => {
    setState({ accessToken, user, isAuthenticated: true });
  };

  const logout = () => {
    setState({ accessToken: null, user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used withing an AuthProvider");
  return context;
};
