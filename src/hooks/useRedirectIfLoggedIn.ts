"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRedirectIfLoggedIn(redirectPath = "/trading-hub/trades") {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(redirectPath);
    }
  }, [status, router, redirectPath]);

  return { isLoading: status === "loading" };
}
