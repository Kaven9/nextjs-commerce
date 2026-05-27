# Next.js 中文电商网站

基于 Next.js 16 + React 19 + Shopify Storefront API 构建的高性能中文电商平台，采用 App Router、Server Components 和现代 React 特性。

## 功能特性

| 模块 | 功能 |
|------|------|
| 商品浏览 | 首页网格展示、轮播图、分类筛选 |
| 商品搜索 | 实时搜索建议、热门搜索、搜索历史、结果排序 |
| 商品详情 | 图片画廊、变体选择器（颜色/尺寸）、相关推荐 |
| 购物车 | 侧边栏购物车、增删改、实时价格、Shopify 结算 |
| 用户认证 | 登录/注册（Shopify Customer Account API）、用户菜单 |
| 用户账户 | 个人信息查看、订单历史（状态中文化） |
| SEO | 动态 Meta、Open Graph、Schema.org JSON-LD、Sitemap |
| 响应式 | 移动端适配、深色模式 |
| 性能优化 | Server Components、ISR 缓存、图片优化（AVIF/WebP） |

## 技术栈

- **框架**：Next.js 16.2.1（App Router、Turbopack）
- **UI**：React 19（Server Components、useActionState、useOptimistic）
- **样式**：Tailwind CSS v4
- **电商平台**：Shopify Storefront API（GraphQL）
- **认证**：NextAuth.js v5
- **语言**：TypeScript 5.8
- **包管理**：pnpm

## 快速开始

### 1. 配置环境变量

复制 `.env.example` 为 `.env.local`，填写以下变量：

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
SHOPIFY_REVALIDATION_SECRET=your-webhook-secret
AUTH_SECRET=your-auth-secret
AUTH_URL=http://localhost:3000
```

### 2. 安装与运行

```bash
pnpm install
pnpm dev
```

访问 [localhost:3000](http://localhost:3000) 查看效果。

### 3. 其他命令

```bash
pnpm build   # 生产构建
pnpm start   # 生产运行
```

## 项目结构

```
app/                        # 页面路由
  account/                  # 用户账户（信息、订单）
  api/auth/                 # NextAuth 认证路由
  api/search-suggestions/   # 搜索建议 API
  product/[handle]/         # 商品详情页
  search/                   # 搜索与分类页
components/                 # React 组件
  auth/                     # 登录、注册、用户菜单
  cart/                     # 购物车组件
  layout/                   # 导航栏、页脚、搜索
  product/                  # 商品展示、变体选择器
lib/                        # 工具库
  auth/                     # NextAuth 配置
  shopify/                  # Shopify API 集成
```

## 部署

推荐部署到 [Vercel](https://vercel.com)，原生支持 ISR 和 Serverless Functions。

1. 将代码推送至 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署完成

详细的 Shopify + Vercel 集成指南请参考 [官方文档](https://vercel.com/docs/integrations/ecommerce/shopify)。
