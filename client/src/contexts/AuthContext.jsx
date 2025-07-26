import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("🔐 Checking authentication...");
      try {
        const userData = await authService.getCurrentUser();
        console.log(
          "✅ Authentication successful:",
          userData ? "User found" : "No user"
        );
        setUser(userData);
      } catch (error) {
        console.log("❌ Authentication failed:", error.message);
        setUser(null);
      } finally {
        console.log("🏁 Authentication check complete");
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    console.log("🔑 Logging in...");
    const userData = await authService.login(credentials);
    // Store token in localStorage
    if (userData.token) {
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("💾 Token stored in localStorage");
    }
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    console.log("📝 Registering...");
    const newUser = await authService.register(userData);
    // Store token in localStorage
    if (newUser.token) {
      localStorage.setItem("token", newUser.token);
      localStorage.setItem("user", JSON.stringify(newUser));
      console.log("💾 Token stored in localStorage");
    }
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    console.log("🚪 Logging out...");
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Add this at the bottom of your existing AuthContext.jsx
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
