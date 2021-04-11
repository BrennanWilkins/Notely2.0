import React from 'react';
import isUrl from '../../../utils/isUrl';
import { useSlate } from 'slate-react';
import { Transforms, Editor, Range, Element as SlateElement } from 'slate';
import { linkIcon } from '../../UI/icons';
import Tooltip from '../../UI/Tooltip/Tooltip';
import isHotkey from 'is-hotkey';

const withLinks = editor => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.insertText = text => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  // on pasting text if text is valid link wrap in link element else insert text
  editor.insertData = data => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link'
  });
  return !!link;
};

const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link'
  });
};

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
}

export const LinkButton = () => {
  const editor = useSlate();

  const clickHandler = e => {
    e.preventDefault();
    const url = window.prompt('Enter the URL of the link:');
    if (!url) { return; }
    insertLink(editor, url);
  };

  return (
    <div
      className={`Toolbar__btn ${isLinkActive(editor) ? 'Toolbar__btn--active' : ''}`}
      onMouseDown={clickHandler}
    >
      {linkIcon}
      <Tooltip position="down">
        Insert Link
        <div>Ctrl+Shift+7</div>
      </Tooltip>
    </div>
  );
};

export const LinkElement = ({ attributes, children, element }) => (
  <a
    {...attributes}
    href={element.url}
    onClick={e => {
      // on ctrl+click open link in new tab/window
      if (e.ctrlKey) {
        let url = element.url;
        if (!url.match(/^https?:\/\//i)) {
          url = 'http://' + url;
        }
        window.open(url, '_blank');
      }
    }}
  >
    {children}
  </a>
);

export default withLinks;
