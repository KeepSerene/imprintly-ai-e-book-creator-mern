import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
  // starting with isLoading as true since we need to check auth on mount!!
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const authenticateUser = (jwt, userInfo) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  const unauthenticateUser = (callback) => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);

    // consumers can pass this callback to handle navigation
    callback?.();
  };

  const checkAuthStatus = () => {
    setIsLoading(true);

    try {
      const jwt = localStorage.getItem("token");
      const stringifiedUser = localStorage.getItem("user");

      if (jwt && stringifiedUser) {
        const userInfo = JSON.parse(stringifiedUser);
        setIsAuthenticated(true);
        setUser(userInfo);
      } else {
        // no auth data found
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUserInfo) => {
    const newUserInfo = { ...user, ...updatedUserInfo };
    localStorage.setItem("user", JSON.stringify(newUserInfo));
    setUser(newUserInfo);
  };

  // check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        checkAuthStatus,
        authenticateUser,
        unauthenticateUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }

  return context;
}
