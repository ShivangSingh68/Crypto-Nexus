import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { getAccountByUserId, getUserById } from "./modules/auth/actions"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async signIn({user, account}) {
      if(!user || !account) {
        return false;
      }
      const existingUser = await db.user.findUnique({
        where: {
          email: user.email!,
        }
      })
      if(!existingUser) {
        const newUser = await db.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,

            accounts: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
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
                sessionState: account.sessionState,
              }
            }
          }
        })

        if(!newUser) {
          return false;
        }
      } else {
        const existingAccount = await db.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            }
          }
        });

        if(!existingAccount) {
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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              sessionState: account.sessionState,
            }
          })
        }
      }
      return true;
    },
    async jwt({token}) {
      if(!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);
      
      if(!existingUser) {
        return token;
      }

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    }, 
    async session({session, token}) {

      if(token.sub && session.user) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        session.user.role = token.role;
      }

      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  ...authConfig 
})