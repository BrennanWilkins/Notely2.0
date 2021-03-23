import React from 'react';
import './NoteContent.css';
import { useSlate } from 'slate-react';
import { toggleBlock, toggleMark, isBlockActive, isMarkActive } from './NoteContent';
import { boldIcon, italicIcon, underlineIcon, heading1Icon, heading2Icon, olIcon, ulIcon, blockQuoteIcon, codeIcon } from '../UI/icons';

const Toolbar = React.memo(() => (
  <div className="Toolbar">
    <MarkButton format="bold" />
    <MarkButton format="italic" />
    <MarkButton format="underline" />
    <MarkButton format="code" />
    <BlockButton format="heading-one" />
    <BlockButton format="heading-two" />
    <BlockButton format="block-quote" />
    <BlockButton format="numbered-list" />
    <BlockButton format="bulleted-list" />
  </div>
));

const formatToIcon = format => {
  switch (format) {
    case 'bold': return boldIcon;
    case 'italic': return italicIcon;
    case 'underline': return underlineIcon;
    case 'code': return codeIcon;
    case 'heading-one': return heading1Icon;
    case 'heading-two': return heading2Icon;
    case 'block-quote': return blockQuoteIcon;
    case 'numbered-list': return olIcon;
    case 'bulleted-list': return ulIcon;
    default: return null;
  }
};

const BlockButton = ({ format }) => {
  const editor = useSlate();

  const clickHandler = e => {
    e.preventDefault();
    toggleBlock(editor, format);
  };

  return (
    <div
      onMouseDown={clickHandler}
      className={`Toolbar__btn ${isBlockActive(editor, format) ? 'Toolbar__btn--active' : ''}`}
    >
      {formatToIcon(format)}
    </div>
  )
};

const MarkButton = ({ format }) => {
  const editor = useSlate();

  const clickHandler = e => {
    e.preventDefault();
    toggleMark(editor, format);
  };

  return (
    <div
      onMouseDown={clickHandler}
      className={`Toolbar__btn ${isMarkActive(editor, format) ? 'Toolbar__btn--active' : ''}`}
    >
      {formatToIcon(format)}
    </div>
  );
};

export default Toolbar;
