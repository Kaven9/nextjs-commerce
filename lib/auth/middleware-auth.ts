import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// 这是一个简化版的 auth 配置，仅用于 middleware
// 不能导入 lib/shopify，因为 middleware 运行在 Edge Runtime
const { auth: middlewareAuth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize() {
        // Middleware 不需要 authorize，只需要验证 session
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});

export { middlewareAuth };
