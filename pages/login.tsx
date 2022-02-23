import React from 'react';
import Layout from '../components/Layout';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import { NextPageContext } from 'next';

const Login = () => {
  const { data: session, status } = useSession();

  if (session) {
    return (
      <div className="">
        <div>
          Signed in as {session?.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <div>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    </div>
  );
};

// export async function getServerSideProps(ctx: NextPageContext) {
//   const session = await getSession(ctx);

//   if (session) {
//     return {
//       redirect: {
//         destination: '/',
//       },
//     };
//   }

//   return {
//     props: {
//       session,
//     },
//   };
// }

export default Login;
