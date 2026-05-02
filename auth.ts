import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "./modules/auth/actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      if (!user || !account) return false;

      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
      });

      if (!existingUser) {
        const newUser = await db.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
            accounts: {
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refreshToken: account.refresh_token,
                accessToken: account.access_token,
                expiresAt: account.expires_at,
                tokenType: account.token_type,
                scope: account.scope,
                idToken: account.id_token,
                // @ts-expect-error — sessionState not in base type
                sessionState: account.sessionState,
              },
            },
            portfolio: {
              create: { value: 25000, cash: 25000 },
            },
          },
        });
        if (!newUser) return false;
      } else {
        const existingAccount = await db.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });
        const existingPortfolio = await db.portfolio.findUnique({
          where: { userId: existingUser.id },
        });
        if (!existingAccount) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refreshToken: account.refresh_token,
              accessToken: account.access_token,
              expiresAt: account.expires_at,
              tokenType: account.token_type,
              scope: account.scope,
              idToken: account.id_token,
              // @ts-expect-error — sessionState not in base type
              sessionState: account.sessionState,
            },
          });
        }
        if (!existingPortfolio) {
          await db.portfolio.create({
            data: { cash: 25000, value: 25000, userId: existingUser.id },
          });
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {

      // With PrismaAdapter + JWT strategy, user.id may be undefined on the
      // initial call — use token.sub as the reliable identifier instead.
      const userId = user?.id ?? token.sub;

      if (!userId) return token;

      // Always fetch on first sign-in (user is present) or when role is missing
      if (user || trigger === "update" || !token.role) {
        const dbUser = await getUserById(userId);
        if (dbUser) {
          token.sub   = dbUser.id;   // ensure sub is always set
          token.name  = dbUser.name;
          token.email = dbUser.email;
          token.role  = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // @ts-expect-error — role extended via next-auth.d.ts
        session.user.role = token.role;
      }
      return session;
    },
  },
});