import React from 'react';
import useResizeObserver from '@react-hook/resize-observer';

const useSize = (target: any) => {
  const [size, setSize] = React.useState<DOMRectReadOnly>(
    {} as DOMRectReadOnly
  );
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    setSize(target.current.offsetWidth);
  }, [target]);

  useResizeObserver(target, (entry) => setSize(entry.contentRect));

  const isOverlay = (() => size?.width + size?.y * 2 < 1024)();

  return { isOverlay, size };
};
export default useSize;
