import { useCallback } from 'react';
import { Text } from 'slate';

const useSearch = search => {
  const decorate = useCallback(([node, path]) => {
    if (!search || !Text.isText(node)) { return []; }
    const ranges = [];
    const { text } = node;
    const parts = text.split(search);
    let offset = 0;

    parts.forEach((part, i) => {
      if (i !== 0) {
        ranges.push({
          anchor: { path, offset: offset - search.length },
          focus: { path, offset },
          highlight: true
        });
      }

      offset = offset + part.length + search.length;
    });

    return ranges;
  }, [search]);

  return { decorate };
};

export default useSearch;
