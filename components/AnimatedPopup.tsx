import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AnimatedPopupProps {
  children: React.ReactNode[];
  isHeader?: boolean;
  isTask?: boolean;
}

const AnimatedPopup: React.FC<AnimatedPopupProps> = ({
  children,
  isHeader,
  isTask,
}) => {
  const [styles, setStyles] = useState('');
  useEffect(() => {
    if (isHeader && !isTask)
      setStyles('overflow-hidden w-36 -left-10 top-14 flex flex-col shadow-md');
    else if (isTask && !isHeader)
      setStyles('translate-y-14 right-8 w-[320px] shadow-md');
    else setStyles('w-[320px] right-0');
  }, [isTask, isHeader]);

  return (
    <AnimatePresence>
      <motion.ul
        className={`${styles} py-2 rounded-md bg-white border border-gray-300 absolute z-[2000] dark:bg-gray-900 dark:border-gray-900`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.ul>
    </AnimatePresence>
  );
};

export default AnimatedPopup;
