import "lib/auth/types";
import { auth } from "lib/auth";
import { getCustomer } from "lib/shopify";
import Image from "next/image";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { connection } from "next/server";

const financialStatusMap: Record<string, string> = {
  PAID: "已付款",
  PENDING: "待付款",
  REFUNDED: "已退款",
  PARTIALLY_PAID: "部分付款",
  VOIDED: "已作废",
};

const fulfillmentStatusMap: Record<string, string> = {
  FULFILLED: "已发货",
  UNFULFILLED: "待发货",
  PARTIALLY_FULFILLED: "部分发货",
  RESTOCKED: "已退货",
};

function translateFinancialStatus(status: string): string {
  return financialStatusMap[status] || status;
}

function translateFulfillmentStatus(status: string): string {
  return fulfillmentStatusMap[status] || status;
}

export default async function OrdersPage() {
  await connection();
  const session = await auth();

  if (!session?.user?.accessToken) {
    return null;
  }

  const customer = await getCustomer(session.user.accessToken);

  if (!customer || customer.orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ShoppingBagIcon className="h-16 w-16 text-neutral-300 dark:text-neutral-600" />
        <p className="mt-4 text-lg font-medium text-neutral-500 dark:text-neutral-400">
          暂无订单记录
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
        我的订单
      </h2>
      <div className="space-y-4">
        {customer.orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
          >
            {/* 订单头部 */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium text-black dark:text-white">
                  订单 {order.orderNumber}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">
                  {new Date(order.processedAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                  {translateFinancialStatus(order.financialStatus)}
                </span>
                <span className="rounded-full bg-neutral-50 px-2.5 py-0.5 font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                  {translateFulfillmentStatus(order.fulfillmentStatus)}
                </span>
              </div>
            </div>

            {/* 订单商品 */}
            <div className="px-6 py-4">
              <ul className="divide-y divide-neutral-100 dark:divide-neutral-700">
                {order.lineItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    {item.variant?.image?.url ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700">
                        <Image
                          src={item.variant.image.url}
                          alt={item.variant.image.altText || item.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
                        <ShoppingBagIcon className="h-5 w-5 text-neutral-300 dark:text-neutral-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-black dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        数量: {item.quantity}
                      </p>
                    </div>
                    {item.variant?.price && (
                      <p className="text-sm font-medium text-black dark:text-white">
                        {Number(item.variant.price.amount).toFixed(2)}{" "}
                        {item.variant.price.currencyCode}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* 订单底部 */}
            <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-3 dark:border-neutral-700">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                合计
              </span>
              <span className="text-sm font-semibold text-black dark:text-white">
                {Number(order.totalPrice.amount).toFixed(2)}{" "}
                {order.totalPrice.currencyCode}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
