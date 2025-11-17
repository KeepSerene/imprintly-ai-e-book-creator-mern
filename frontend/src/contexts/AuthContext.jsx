import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const signIn = (jwt, userData) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const singOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/";
  };

  const checkAuthStatus = () => {
    // reset states
    setIsLoading(true);
    setIsAuthenticated(false);

    try {
      const jwt = localStorage.getItem("token");
      const stringifiedUser = localStorage.getItem("user");

      if (jwt && stringifiedUser) {
        const userData = JSON.parse(stringifiedUser);
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      singOut();
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, updatedUserData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

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
        signIn,
        singOut,
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
