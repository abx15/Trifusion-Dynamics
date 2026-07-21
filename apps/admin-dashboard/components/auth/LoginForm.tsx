"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/lib/auth-store";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await apiClient.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user: returnedUser } = res.data;

      // Handle stub vs real backend formats
      let finalUser = returnedUser;
      if (!finalUser && accessToken) {
        const decoded = parseJwt(accessToken);
        finalUser = {
          id: decoded?.sub || "admin_id",
          email: decoded?.email || email,
          name: decoded?.name || "System Admin",
          isActive: true,
          organizationId: decoded?.orgId || "org_id",
          roles: decoded?.roles || ["admin"],
          permissions: decoded?.permissions || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      // Update Zustand in-memory state
      setAuth(finalUser, accessToken);

      // Save refresh token in cookie for middleware use
      // Fallback to accessToken as refresh token if backend only returned accessToken (stub login)
      const tokenToStore = refreshToken || accessToken;
      Cookies.set("refresh_token", tokenToStore, {
        secure: true,
        sameSite: "strict",
        expires: 7, // 7 days
      });

      toast.success(`Welcome back, ${finalUser.name}!`);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login failure:", err);
      const status = err.response?.status;
      if (status === 401) {
        setError("Invalid email or password");
      } else if (status === 429) {
        setError("Too many attempts, please wait a few minutes");
      } else {
        setError(err.response?.data?.message || "An unexpected network error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
        <CardDescription>
          Enter your admin credentials to access the operations panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-500/20 p-3 text-sm text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="name@trifusiondynamics.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
