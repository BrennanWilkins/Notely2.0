import { useEffect, useRef } from 'react';

export const useModalToggle = (ref, close) => {
  return useEffect(() => {
    const clickHandler = e => {
      if (ref.current.contains(e.target)) { return; }
      close();
    };

    document.addEventListener('mousedown', clickHandler);
    return () => document.removeEventListener('mousedown', clickHandler);
  }, []);
};

export const useDidUpdate = (callback, deps) => {
  const hasMounted = useRef(false);

  return useEffect(() => {
    if (hasMounted.current) { callback(); }
    else { hasMounted.current = true; }
  }, deps);
};
