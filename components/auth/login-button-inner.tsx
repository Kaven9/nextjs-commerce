"use client";

import "lib/auth/types";
import { UserIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useState } from "react";
import LoginModal from "./login-modal";
import UserMenu from "./user-menu";

export default function LoginButtonInner() {
  const { data: session, status } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  if (status === "authenticated" && session?.user) {
    return <UserMenu />;
  }

  return (
    <>
      <button
        aria-label="登录"
        onClick={() => setIsLoginOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
      >
        <UserIcon className="h-5 w-5" />
      </button>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
}
