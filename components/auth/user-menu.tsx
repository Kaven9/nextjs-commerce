"use client";

import "lib/auth/types";
import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";

export default function UserMenu() {
  const session = useSession();

  if (!session?.data?.user) return null;

  const initials = session.data.user.email
    ? session.data.user.email.charAt(0).toUpperCase()
    : "?";

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium text-black hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700">
        {initials}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          <div className="border-b border-neutral-200 px-4 py-2 dark:border-neutral-700">
            <p className="text-sm font-medium text-black dark:text-white">
              {session.data.user.email}
            </p>
          </div>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/account"
                className={clsxMenuItem(active)}
              >
                我的账户
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/account/orders"
                className={clsxMenuItem(active)}
              >
                我的订单
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => signOut()}
                className={clsxMenuItem(active, true)}
              >
                退出登录
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function clsxMenuItem(active: boolean, isButton = false) {
  const base = isButton ? "w-full text-left" : "";
  return `${base} block px-4 py-2 text-sm ${
    active
      ? "bg-neutral-100 text-black dark:bg-neutral-700 dark:text-white"
      : "text-neutral-700 dark:text-neutral-300"
  }`;
}
