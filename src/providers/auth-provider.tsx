"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import { creatorsService } from "@/features/creators/services/creators.service";
import { CreatorProfile } from "@/features/creators/types";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  role?: "ADMIN" | "CREATOR" | "ACCUEIL";
  is_superuser?: boolean;
  is_authenticated?: boolean;
}

interface AuthContextType {
  user: User | null;
  creatorProfile: CreatorProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const data = await authService.me();
      
      if (data.is_authenticated) {
        setUser(data);
        if (data.role === "CREATOR") {
          const profile = await creatorsService.getMe();
          setCreatorProfile(profile);
        } else {
          setCreatorProfile(null);
        }
      } else {
        setUser(null);
        setCreatorProfile(null);
      }
    } catch (error) {
      setUser(null);
      setCreatorProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname.startsWith("/login");
      
      if (!user && !isAuthPage) {
        router.push("/login");
        return;
      }

      if (user && isAuthPage) {
        if (user.role === "CREATOR") {
          router.push("/my-space");
        } else if (user.role === "ADMIN" || user.role === "ACCUEIL" || user.is_superuser) {
          router.push("/dashboard");
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async () => {
    await checkAuth();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setCreatorProfile(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        creatorProfile,
        isLoading,
        isAuthenticated: !!(user && user.is_authenticated),
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
