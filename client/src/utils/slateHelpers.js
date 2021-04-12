import { Node } from 'slate';

export const serializeToText = nodes => {
  if (!nodes || !nodes.length) { return ''; }
  return nodes.map(n => Node.string(n)).join('');
};

export const serializeToTitle = nodes => {
  let txt, title;
  if (!nodes || !nodes.length) {
    txt = '';
    title = 'New Note';
  } else {
    let arr = nodes.map(n => Node.string(n)).filter(n => n !== '');
    title = arr[0] || 'New Note';
    txt = arr.slice(1) || '';
  }

  let body = (
    <>
      <div>{title}</div>
      {txt}
    </>
  );
  return { title, body };
};
