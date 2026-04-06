"use client";

import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { initialized, authenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initialized && !authenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [initialized, authenticated, router, pathname]);

  if (!initialized) return <LoadingSpinner />;
  if (!authenticated) return <LoadingSpinner />;

  return <>{children}</>;
}
