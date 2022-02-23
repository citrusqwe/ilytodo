import '../styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import { getSession, SessionProvider } from 'next-auth/react';
import Layout, { Project } from '../components/Layout';
import { GetServerSideProps, NextPageContext } from 'next';
import { fb } from '../firebase/functions';
import App from 'next/app';

interface TodoAppProps extends AppProps {
  projects: Project[];
  user: any;
}

export default function TodoApp({
  Component,
  pageProps: { session, ...pageProps },
  projects,
  user,
}: TodoAppProps) {
  return (
    <SessionProvider session={session}>
      <Layout projects={projects} user={user}>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

TodoApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const session = await getSession(appContext.ctx);
  const user = await fb().getUserByEmail(session?.user?.email as string);
  const projects = await fb().getAllProjects(user);

  return { ...appProps, projects, user };
};
