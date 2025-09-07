import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
