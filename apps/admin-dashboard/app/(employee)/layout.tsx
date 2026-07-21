"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useAuthStore } from "@/lib/auth-store";
import { apiClient } from "@/lib/api-client";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, setAuth, clearAuth } = useAuthStore();
  const [collapsed, setCollapsed] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(!accessToken);
  const router = useRouter();

  React.useEffect(() => {
    async function restoreSession() {
      if (accessToken) {
        setIsInitializing(false);
        return;
      }

      const currentRefreshToken = Cookies.get("refresh_token");
      if (!currentRefreshToken) {
        clearAuth();
        router.replace("/login");
        return;
      }

      try {
        const res = await apiClient.post("/auth/refresh", {
          refreshToken: currentRefreshToken,
        });
        const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

        const decoded = parseJwt(newAccess);
        const user = {
          id: decoded?.sub || "admin_id",
          email: decoded?.email || "admin@trifusiondynamics.com",
          name: decoded?.name || "System Admin",
          isActive: true,
          organizationId: decoded?.orgId || "org_id",
          roles: decoded?.roles || ["admin"],
          permissions: decoded?.permissions || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setAuth(user, newAccess);

        Cookies.set("refresh_token", newRefresh || currentRefreshToken, {
          secure: true,
          sameSite: "strict",
          expires: 7,
        });
      } catch (err) {
        console.warn("Auto-restore session failed:", err);
        clearAuth();
        Cookies.remove("refresh_token");
        router.replace("/login");
      } finally {
        setIsInitializing(false);
      }
    }

    restoreSession();
  }, [accessToken, setAuth, clearAuth, router]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <span className="text-sm text-slate-500 font-medium font-sans">
            Syncing Operations...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 h-full transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* Main Panel Content Container */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar sidebarOpen={false} setSidebarOpen={() => {}} />
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-zinc-900/30 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
