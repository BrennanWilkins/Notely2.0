import { useEffect } from 'react';

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
