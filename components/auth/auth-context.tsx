"use client";

import "lib/auth/types";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode, useState, useEffect } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
