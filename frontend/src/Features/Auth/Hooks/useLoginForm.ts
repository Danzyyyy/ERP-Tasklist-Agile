// src/Features/Auth/Hooks/useLoginForm.ts
import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/Hooks/useAuth";
import { ROUTE_PATHS } from "@/Constants/RouteConstant";

export function useLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { demoTokens, login } = useAuth();

  const [selectedToken, setSelectedToken] = useState<string>("mock_pm");
  const selectedDemo =
    demoTokens.find((d) => d.token === selectedToken) ||
    demoTokens[1] ||
    demoTokens[0];

  const [identifier, setIdentifier] = useState<string>(selectedDemo?.email || "pm@anaheim.id");
  const [password, setPassword] = useState<string>("anaheim-demo");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberSession, setRememberSession] = useState<boolean>(true);

  const selectToken = (token: string) => {
    setSelectedToken(token);
    const matched = demoTokens.find((d) => d.token === token);
    if (matched) {
      setIdentifier(matched.email);
    }
  };

  const handleIdentifierChange = (value: string) => {
    setIdentifier(value);
    const normalized = value.trim().toLowerCase();
    const matched = demoTokens.find(
      (d) => d.email.toLowerCase() === normalized || d.token.toLowerCase() === normalized,
    );
    if (matched) {
      setSelectedToken(matched.token);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = identifier.trim();
    const normalized = trimmed.toLowerCase();

    const matched = trimmed
      ? demoTokens.find(
          (d) => d.email.toLowerCase() === normalized || d.token.toLowerCase() === normalized,
        )
      : undefined;

    // Allow either matched demo account (by email/token) OR manual custom Bearer token
    const isCustomBearerToken = Boolean(trimmed) && !matched && !trimmed.includes("@");
    const tokenToUse = matched
      ? matched.token
      : isCustomBearerToken
        ? trimmed
        : selectedDemo.token;
    const roleToUse = matched?.role || selectedDemo.role;

    login(tokenToUse, roleToUse);

    const destination = location.state?.from?.pathname || ROUTE_PATHS.DASHBOARD;
    navigate(destination, { replace: true });
  };

  return {
    demoTokens,
    selectedToken,
    selectedDemo,
    selectToken,
    identifier,
    handleIdentifierChange,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    rememberSession,
    setRememberSession,
    handleLogin,
  };
}

export default useLoginForm;
