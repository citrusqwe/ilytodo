import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { db } from '../../../firebase';
import { FirebaseAdapter } from '../../../firebase/adapter';

export default NextAuth({
  adapter: FirebaseAdapter(db),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  theme: {
    colorScheme: 'light',
    brandColor: '#646464',
    logo: 'https://firebasestorage.googleapis.com/v0/b/ily-todo-ec6bb.appspot.com/o/791bf89189164007bdfadca55c23dd2a.png?alt=media&token=aa5e4587-25d0-4654-92b5-d6a3aaf21bc3',
  },
  callbacks: {
    async session({ session, token, user }) {
      session.id = user.id;
      return session;
    },
  },
});
