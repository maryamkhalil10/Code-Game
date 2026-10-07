import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("cg_token");
      if (token) {
        try {
          const userData = await authApi.getMe(token);
          setUser(userData);
        } catch (err) {
          console.error("Auth init failed", err);
          localStorage.removeItem("cg_token");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const { token } = await authApi.login(email, password);
    localStorage.setItem("cg_token", token);
    const userData = await authApi.getMe(token);
    setUser(userData);
  };

  const register = async (username, email, password) => {
    return await authApi.register(username, email, password);
  };

  const logout = () => {
    localStorage.removeItem("cg_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);