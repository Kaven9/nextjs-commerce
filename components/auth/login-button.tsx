"use client";

import "lib/auth/types";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

// 动态导入内部组件，避免 SSR 期间 useSession 报错
const LoginButtonInner = dynamic(
  () => import("components/auth/login-button-inner"),
  { ssr: false }
);

export default function LoginButton() {
  return (
    <SessionProvider>
      <LoginButtonInner />
    </SessionProvider>
  );
}
