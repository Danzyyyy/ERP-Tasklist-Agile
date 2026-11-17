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
  const [customToken, setCustomToken] = useState("");
  const [useCustomToken, setUseCustomToken] = useState(false);

  const selectedDemo =
    demoTokens.find((d) => d.token === selectedToken) ||
    demoTokens[1] ||
    demoTokens[0];

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const trimmedCustom = customToken.trim();
    const matchedCustom = trimmedCustom
      ? demoTokens.find((d) => d.token === trimmedCustom)
      : undefined;
    const tokenToUse = useCustomToken && trimmedCustom ? trimmedCustom : selectedDemo.token;
    const roleToUse = matchedCustom?.role || selectedDemo.role;
    login(tokenToUse, roleToUse);

    const destination = location.state?.from?.pathname || ROUTE_PATHS.DASHBOARD;
    navigate(destination, { replace: true });
  };

  const selectToken = (token: string) => {
    setSelectedToken(token);
    setUseCustomToken(false);
  };

  const toggleCustomToken = () => {
    setUseCustomToken((prev) => !prev);
  };

  return {
    demoTokens,
    selectedToken,
    selectedDemo,
    selectToken,
    customToken,
    setCustomToken,
    useCustomToken,
    toggleCustomToken,
    handleLogin,
  };
}

export default useLoginForm;

