import { createContext, useContext, useState, useEffect } from "react";
import { authService, familyService } from "../services/api";
import { initializeSocket, joinFamilyRoom, disconnectSocket } from "../services/socket";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login when app loads
  useEffect(() => {

    const token = localStorage.getItem("authToken");

    if (token) {

      authService.getProfile()
        .then((data) => {
          setUser(data.user);
          initializeSocket(token);
          if (data.user.familyId) {
            joinFamilyRoom(data.user.familyId);
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });

    } else {
      setLoading(false);
    }

  }, []);

  // LOGIN
  const login = async (email, password) => {

    const response = await authService.login(email, password);

    if (!response.success) {
      throw new Error("Login failed");
    }

    localStorage.setItem("authToken", response.token);
    localStorage.setItem("userId", response.user.id);

    setUser(response.user);
    
    initializeSocket(response.token);
    if (response.user.familyId) {
      joinFamilyRoom(response.user.familyId);
    }

    return response;
  };

  // REGISTER
  const register = async (name, email, password) => {

    const response = await authService.register(name, email, password);

    if (!response.success) {
      throw new Error(response.message || "Registration failed");
    }

    localStorage.setItem("authToken", response.token);
    localStorage.setItem("userId", response.user.id);

    setUser(response.user);
    
    initializeSocket(response.token);
    if (response.user.familyId) {
      joinFamilyRoom(response.user.familyId);
    }

    return response;
  };

  // JOIN FAMILY
  const joinFamily = async (inviteCode) => {

    const response = await familyService.joinFamily(inviteCode);

    setUser((prev) => ({
      ...prev,
      familyId: response.family?.id,
    }));

    return response;
  };

  // CREATE FAMILY
  const createFamily = async (familyName) => {

    const response = await familyService.createFamily(familyName);

    setUser((prev) => ({
      ...prev,
      familyId: response.family?.id,
    }));

    return response;
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");

    setUser(null);
    disconnectSocket();
  };

  const value = {
    user,
    loading,
    login,
    register,
    joinFamily,
    createFamily,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};