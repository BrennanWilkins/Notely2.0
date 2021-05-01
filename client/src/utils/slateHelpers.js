import { Node } from 'slate';

export const serializeToText = (nodes, delimiter) => {
  if (!nodes || !nodes.length) { return ''; }
  return nodes.map(n => Node.string(n)).join(delimiter || '');
};

export const serializeBody = nodes => {
  if (!nodes || !nodes.length) {
    return { title: '', subTitle: '', text: '' };
  }

  const arr = nodes.map(n => Node.string(n)).filter(n => n !== '');
  const title = arr[0] || '';
  const subTitle = arr.length > 1 ? arr.slice(1).join('') : '';
  const text = arr.join('');

  return { title, subTitle, text };
};
