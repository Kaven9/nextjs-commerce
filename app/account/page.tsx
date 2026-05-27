import "lib/auth/types";
import { auth } from "lib/auth";
import { getCustomer } from "lib/shopify";
import { connection } from "next/server";

export default async function AccountPage() {
  await connection();
  const session = await auth();

  if (!session?.user?.accessToken) {
    return null;
  }

  const customer = await getCustomer(session.user.accessToken);
  const displayName =
    customer?.firstName || customer?.email?.split("@")[0] || "用户";

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
        欢迎回来，{displayName}
      </h2>

      <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
        <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <h3 className="text-sm font-medium text-black dark:text-white">
            个人信息
          </h3>
        </div>
        <dl className="divide-y divide-neutral-200 dark:divide-neutral-700">
          <InfoRow label="姓名">
            {customer?.firstName || customer?.lastName
              ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
              : "未设置"}
          </InfoRow>
          <InfoRow label="邮箱">{customer?.email || "未设置"}</InfoRow>
          <InfoRow label="手机">{customer?.phone || "未设置"}</InfoRow>
        </dl>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <dt className="text-sm text-neutral-500 dark:text-neutral-400">
        {label}
      </dt>
      <dd className="text-sm font-medium text-black dark:text-white">
        {children}
      </dd>
    </div>
  );
}
