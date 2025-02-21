// eslint-disable-next-line
import { JWT } from 'next-auth/jwt';
import NextAuth, { type DefaultSession } from 'next-auth';
import authConfig from '@/auth.config';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getUserById } from '@/actions/userActions';
import { accounts, users, verificationTokens } from '@/db/schema';
import { db } from '@/db';
import { Role } from '@/lib/constants';

declare module 'next-auth' {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      const existingUser = await getUserById(user.id!);
      if (!existingUser?.emailVerified) return false;
      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
    async session({ token, session }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role;
      }

      return session;
    },
  },
});
