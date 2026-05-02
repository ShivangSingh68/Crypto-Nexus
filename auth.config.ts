import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token }) {
            return token;
        },

        async session({ session, token }) {

            if (session.user) {
                session.user.id = token.sub ?? "";
                // @ts-expect-error — role extended via next-auth.d.ts
                session.user.role = token.role;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;