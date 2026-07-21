"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { apiClient } from "@/lib/api-client";
import { toast } from "@/lib/toast";

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = async () => {
    try {
      const currentRefreshToken = Cookies.get("refresh_token");
      if (currentRefreshToken) {
        // Send JSON body to POST /auth/logout
        await apiClient.post("/auth/logout", {
          refreshToken: currentRefreshToken,
        });
      }
    } catch (err) {
      console.warn("Backend token revocation on logout failed:", err);
    } finally {
      // Ensure frontend is cleared unconditionally
      clearAuth();
      Cookies.remove("refresh_token");
      toast.success("Successfully logged out");
      
      // Hard redirect to clear any state memory and reload middleware guards
      router.replace("/login");
    }
  };

  return { logout };
}

export default useLogout;
