import React from 'react';
import { motion } from 'framer-motion';
import { checkXIndent } from '../utils';
import { AiOutlineHome } from 'react-icons/ai';
import SidebarLink from './SidebarLink';

interface SidebarProps {
  size: DOMRectReadOnly;
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ size, children }) => {
  return (
    <motion.div
      key="content"
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { x: checkXIndent(size?.width) },
        collapsed: { x: -300 },
      }}
      transition={{
        duration: 0.3,
      }}
      className={`lg:w-56 w-48 lg:static lg:pr-4 px-4 dark:bg-gray-800 group absolute z-[1999] bg-white 
    h-[calc(100%-45px-32*2px)] md:h-[calc(100%-45px-32*3px-20px)]  rounded-b-md mb-2`}
    >
      <ul>
        <SidebarLink
          name={'Overview'}
          icon={
            <AiOutlineHome className="stroke-gray-theme dark:stroke-white" />
          }
          margin
        />
      </ul>
      {children}
    </motion.div>
  );
};

export default React.memo(Sidebar);
