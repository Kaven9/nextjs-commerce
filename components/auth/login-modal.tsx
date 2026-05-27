"use client";

import "lib/auth/types";
import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useActionState } from "react";
import { loginAction, registerAction } from "app/actions/auth";

type AuthMode = "login" | "register";

type FormState = {
  error?: string;
  success?: boolean;
};

export default function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginState, loginFormAction, loginPending] = useActionState(
    loginAction,
    {}
  );
  const [registerState, registerFormAction, registerPending] = useActionState(
    registerAction,
    {}
  );

  const currentState = mode === "login" ? loginState : registerState;
  const isPending = mode === "login" ? loginPending : registerPending;

  // 成功后关闭弹窗
  if (currentState.success && isOpen) {
    onClose();
  }

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="transition-all ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-all ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition-all ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition-all ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold text-black dark:text-white">
                  {mode === "login" ? "登录" : "注册"}
                </Dialog.Title>
                <button
                  aria-label="关闭"
                  onClick={onClose}
                  className="rounded-md p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {currentState.error && (
                <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {currentState.error}
                </div>
              )}

              <form
                action={mode === "login" ? loginFormAction : registerFormAction}
                className="mt-4 space-y-4"
              >
                {mode === "register" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        名
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-black placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-500"
                        placeholder="可选"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        姓
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-black placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-500"
                        placeholder="可选"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    邮箱
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-black placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-500"
                    placeholder="请输入邮箱"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    密码
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-black placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-500"
                    placeholder="请输入密码"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className={clsx(
                    "w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800",
                    isPending && "cursor-not-allowed opacity-60"
                  )}
                >
                  {isPending
                    ? "处理中..."
                    : mode === "login"
                      ? "登录"
                      : "注册"}
                </button>
              </form>

              <div className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
                {mode === "login" ? (
                  <>
                    还没有账户？{" "}
                    <button
                      onClick={switchMode}
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      立即注册
                    </button>
                  </>
                ) : (
                  <>
                    已有账户？{" "}
                    <button
                      onClick={switchMode}
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      去登录
                    </button>
                  </>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
