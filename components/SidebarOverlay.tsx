import React from 'react';
import { motion } from 'framer-motion';

interface SidebarOverlayProps {
  setSidebarMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarMenuOpen: boolean;
}
const SidebarOverlay: React.FC<SidebarOverlayProps> = ({
  setSidebarMenuOpen,
  sidebarMenuOpen,
}) => {
  return (
    <motion.div
      animate={sidebarMenuOpen ? 'open' : 'collapsed'}
      variants={{
        open: { opacity: 1, visibility: 'visible' },
        collapsed: { opacity: 0, visibility: 'hidden' },
      }}
      className="bg-black/20 w-full h-full fixed left-0 right-0 z-[1100]"
      onClick={() => setSidebarMenuOpen(false)}
    />
  );
};

export default SidebarOverlay;
