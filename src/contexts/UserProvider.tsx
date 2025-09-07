import { useState, ReactNode } from "react";
import { User, UserContext } from "./UserContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ This file now only exports a component (Fixes ESLint error)
export default UserProvider;
