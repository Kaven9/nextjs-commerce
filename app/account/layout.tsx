import "lib/auth/types";
import { auth } from "lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { connection } from "next/server";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const navItems = [
    { href: "/account", label: "账户概览", icon: UserIcon },
    { href: "/account/orders", label: "我的订单", icon: ShoppingBagIcon },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-black dark:text-white">
        我的账户
      </h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <nav className="w-full md:w-56">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
