import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createCustomerAccessToken } from "lib/shopify";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { token, errors } = await createCustomerAccessToken(
            credentials.email as string,
            credentials.password as string
          );

          if (errors.length > 0 || !token) {
            return null;
          }

          return {
            id: token.accessToken,
            email: credentials.email as string,
            name: "",
            accessToken: token.accessToken,
          };
        } catch (error) {
          console.error("认证失败:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.accessToken = token.accessToken as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
