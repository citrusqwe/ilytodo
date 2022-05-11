import App from 'next/app';
import type { AppContext, AppProps } from 'next/app';
import { getSession, SessionProvider } from 'next-auth/react';
import Layout from '../components/Layout';
import { fb } from '../firebase/functions';
import 'react-loading-skeleton/dist/skeleton.css';
import '../styles/globals.css';
import { createContext } from 'react';

export type Project = {
  id: string;
  name: string;
  color: string;
};
export type User = {
  email: string;
  emailVerified: null | string;
  id: string;
  image: string;
  name: string;
};

interface TodoAppProps extends AppProps {
  projects: Project[];
  user: User;
}

interface TodoAppContextInterface {
  projects: Project[];
  user: User;
}

export const TodoAppContext = createContext<TodoAppContextInterface>({
  projects: [],
  user: {
    email: '',
    emailVerified: null,
    id: '',
    image: '',
    name: '',
  },
});

export default function TodoApp({
  Component,
  pageProps: { session, ...pageProps },
  projects,
  user,
}: TodoAppProps) {
  return (
    <SessionProvider session={session}>
      <TodoAppContext.Provider value={{ projects, user }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TodoAppContext.Provider>
    </SessionProvider>
  );
}

TodoApp.getInitialProps = async (appContext: AppContext) => {
  const [appProps, session] = await Promise.all([
    App.getInitialProps(appContext),
    getSession(appContext.ctx),
  ]);
  const user = await fb().getUserByEmail(session?.user?.email as string);
  const projects = await fb().getAllProjects(user);

  return { ...appProps, projects, user };
};
