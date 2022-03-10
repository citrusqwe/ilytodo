import Link from 'next/link';
import React, { ReactElement } from 'react';

interface SidebarLinkProps {
  name: string;
  icon: ReactElement;
  margin?: boolean;
  id?: string;
  isProject?: boolean;
  currentId?: string | string[];
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  name,
  icon,
  margin,
  id,
  isProject,
  currentId,
}: any) => {
  return (
    <Link href={`/${isProject ? `project/${id}` : name.toLowerCase()}`}>
      <a
        className={`flex items-center ${
          margin ? 'mb-6' : 'mb-2'
        } py-2 px-3 rounded-lg transition whitespace-nowrap overflow-hidden  duration-300 ${
          currentId === id && isProject ? 'bg-gray-300' : ''
        } hover:bg-gray-300`}
      >
        <li className="flex items-center overflow-hidden overflow-ellipsis w-11/12">
          <span className="mr-4">{icon}</span>
          {name}
        </li>
      </a>
    </Link>
  );
};

export default SidebarLink;
