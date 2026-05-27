"use server";

import { createCustomer, createCustomerAccessToken } from "lib/shopify";
import { signIn } from "lib/auth";

export async function loginAction(
  _prev: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "请输入邮箱和密码" };
  }

  try {
    const { token, errors } = await createCustomerAccessToken(email, password);

    if (errors.length > 0 || !token) {
      return { error: "邮箱或密码错误" };
    }

    // 使用 NextAuth 的 signIn 来建立 session
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch {
    return { error: "登录失败，请稍后重试" };
  }
}

export async function registerAction(
  _prev: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (!email || !password) {
    return { error: "请填写所有必填项" };
  }

  if (password.length < 5) {
    return { error: "密码至少需要5个字符" };
  }

  try {
    const { errors } = await createCustomer({
      email,
      password,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    });

    if (errors.length > 0) {
      return { error: errors[0] };
    }

    // 注册成功后自动登录
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch {
    return { error: "注册失败，请稍后重试" };
  }
}
