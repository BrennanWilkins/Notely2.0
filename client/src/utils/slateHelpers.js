import { Node } from 'slate';

export const serializeToText = (nodes, delimiter) => {
  if (!nodes || !nodes.length) { return ''; }
  return nodes.map(n => Node.string(n)).join(delimiter || '');
};

export const serializeBody = (nodes, searchQuery) => {
  if (!nodes || !nodes.length) {
    return { title: '', txt: '', matchesSearch: false };
  }

  let matchesSearch = false;
  let arr = nodes.map(n => Node.string(n)).filter(n => n !== '');
  let title = arr[0] || '';
  let txt = arr.length > 1 ? arr.slice(1).join('') : '';
  if (searchQuery) {
    matchesSearch = arr.join('').includes(searchQuery);
  }

  return { title, txt, matchesSearch };
};
