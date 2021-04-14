const escapeHtml = require('./escapeHtml');
const isText = require('./isText');
const getHtml = require('./getHtml');

const serializeBody = node => {
  if (isText(node)) {
    let string = escapeHtml(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.code) {
      string = `<code style="background-color: #f5f5f5">${string}</code>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    return string;
  }

  const children = node.children.map(node => serializeBody(node)).join('');

  switch (node.type) {
    case 'block-quote':
    return (
      `<blockquote style="border-left: 2px solid #aaaaaa;margin-left:0;margin-right:0;padding-left:10px;color:#7e7e7e;font-style:italic;">
        <p>${children}</p>
      </blockquote>`
    );
    case 'bulleted-list':
      return `<ul>${children}</ul>`;
    case 'heading-one':
      return `<h1>${children}</h1>`;
    case 'heading-two':
      return `<h2>${children}</h2>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'numbered-list':
      return `<ol>${children}</ol>`;
    case 'check-list-item':
      return (
        `<div style="margin: 5px 0;display: flex;align-items: center;">
          <span style="margin-right: 0.75em;">
            <input type="checkbox" ${node.checked ? 'checked' : ''} />
          </span>
          <span style="text-decoration: ${node.checked ? 'line-through' : 'none'};">
            ${children}
          </span>
        </div>`
      );
    case 'link':
      return `<a href="${escapeHtml(node.url)}">${children}</a>`;
    default:
      return `<p>${children}</p>`;
  }
};

const stringifyNode = node => {
  if (isText(node)) {
    return node.text;
  } else {
    return node.children.map(stringifyNode).join('');
  }
};

const serialize = body => {
  const htmlStr = body.map(node => serializeBody(node)).join('');
  const title = body.map(node => stringifyNode(node)).join('').slice(0, 20) || 'Untitled Note';

  return getHtml(htmlStr, title);
};

module.exports = serialize;
