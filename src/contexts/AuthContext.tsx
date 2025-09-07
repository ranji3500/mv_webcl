import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserDetailsModel } from "../interface/common.interface";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: UserDetailsModel | null;
  setAuth: (auth: boolean, userData?: UserDetailsModel) => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: null,
  setAuth: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserDetailsModel | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/verify_token`);

      setIsAuthenticated(true);
      setUser(res.data);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   let nonSecure = ['login','register,verify_otp,send_otp']
  //   if(!nonSecure.include("winodw.url"){
  //     verifyToken();
  //   }
  // }, []);

  useEffect(() => {
  const nonSecure = ['login', 'register', 'verify_otp', 'send_otp'];
  const currentPath = window.location.pathname;
console.log(currentPath)
const isNonSecureRoute = nonSecure.some(route => currentPath.includes(route));
console.log(isNonSecureRoute)

  if (!isNonSecureRoute) {
    verifyToken();
  }
}, []);


  const setAuth = (auth: boolean, userData?: UserDetailsModel) => {
    setIsAuthenticated(auth);
    setUser(userData ?? null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
