import React from 'react';
import useResizeObserver from '@react-hook/resize-observer';

const useSize = (target: any) => {
  const [size, setSize] = React.useState<DOMRectReadOnly>(
    {} as DOMRectReadOnly
  );

  React.useLayoutEffect(() => {
    setSize(target.current.offsetWidth);
  }, [target]);

  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};
export default useSize;
