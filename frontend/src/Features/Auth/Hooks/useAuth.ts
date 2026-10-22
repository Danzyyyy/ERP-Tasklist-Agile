// src/Features/Auth/Hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext, type AuthContextType } from "../Context/AuthContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
