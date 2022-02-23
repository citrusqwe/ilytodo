import Link from 'next/link';
import React, { ReactElement } from 'react';

interface SidebarLinkProps {
  name: string;
  icon: ReactElement;
  margin?: boolean;
  id?: string;
  isProject?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  name,
  icon,
  margin,
  id,
  isProject,
}: any) => {
  return (
    <Link href={`/${isProject ? `project/${id}` : name.toLowerCase()}`}>
      <a
        className={`flex items-center ${
          margin ? 'mb-6' : 'mb-4'
        } py-2 px-3 rounded-lg transition duration-300 hover:bg-gray-300`}
      >
        <li className="flex items-center">
          <span className="mr-4">{icon}</span>
          {name}
        </li>
      </a>
    </Link>
  );
};

export default SidebarLink;
