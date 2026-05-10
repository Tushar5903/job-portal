import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/api.js";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await api.getCurrentUser();
        if (active) {
          setUser(response.data);
        }
      } catch (err) {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();
    return () => {
      active = false;
    };
  }, []);

  const login = async (formData) => {
    setLoading(true);
    try {
      const response = await api.login(formData);
      setUser(response.data.user);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const response = await api.register(formData);
      setUser(response.data.user);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const response = await api.updateCandidateProfile(formData);
      setUser(response.data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async (file) => {
    setLoading(true);
    try {
      const response = await api.uploadCandidateResume(file);
      setUser(response.data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    uploadResume,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
