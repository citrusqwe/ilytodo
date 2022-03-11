import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import OverviewSvg from '../public/overview.svg';

const Overview = () => {
  return (
    <div className="h-full w-full flex justify-center items-center ">
      <Head>
        <title>Ilytodo</title>
      </Head>
      <div className="text-center -translate-y-28">
        <Image
          src={OverviewSvg.src}
          width={OverviewSvg.width}
          height={200}
          className="mb-2"
          alt="Preview image"
        />
        <h2 className="text-gray-600">Start by creating a new project!</h2>
        <h2 className="text-gray-600">
          Or manage your todos in existing projects.
        </h2>
      </div>
    </div>
  );
};

export default Overview;
