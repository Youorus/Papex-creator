"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginValues } from "../schemas/auth.schema";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useState } from "react";
import { authService } from "../services/auth.service";
import { useAuth } from "@/providers/auth-provider";
import { showApiErrorToast } from "@/shared/errors/api-error";
import { Loader2, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login: updateAuthContext } = useAuth();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      await authService.login(values);
      await updateAuthContext();
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl shadow-[#173083]/5 border-slate-200/60 bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-2xl">
      <CardHeader className="space-y-3 pb-6 pt-8">
        <CardTitle className="text-3xl font-black text-center tracking-tight text-slate-900 dark:text-white">Bienvenue</CardTitle>
        <CardDescription className="text-center text-sm font-medium text-slate-500">
          Connectez-vous à votre espace<br/>
          <span className="text-[#173083] dark:text-blue-400 font-bold uppercase tracking-widest mt-1 block">Créateur & Administrateur</span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-2">
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold ml-1">Adresse Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nom@exemple.fr"
              className="h-12 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-[#173083] rounded-xl transition-all"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive ml-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold">Mot de passe</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-12 pr-12 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-[#173083] rounded-xl transition-all"
                {...form.register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#173083] transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive ml-1">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="pb-8 pt-4">
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-[#173083] to-[#2546b5] text-white rounded-xl shadow-lg shadow-[#173083]/20 hover:shadow-[#173083]/40 hover:-translate-y-0.5 transition-all duration-200" 
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Accéder à mon espace"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
