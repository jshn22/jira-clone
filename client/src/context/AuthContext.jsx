import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import authService from "../services/authService";

const AuthContext = createContext();

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error("Error fetching user:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  // LOGIN
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
  };

  // REGISTER
  const register = async (name, email, password) => {
    try {
      const data = await authService.register(
        name,
        email,
        password
      );

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      throw error;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);