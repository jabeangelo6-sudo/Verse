"use client";
import { useState } from "react";
import { ME } from "@/lib/mock-data";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState(ME);

  const login = async (email: string) => {
    await new Promise((r) => setTimeout(r, 1200));
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return { isAuthenticated, user, login, logout };
}
