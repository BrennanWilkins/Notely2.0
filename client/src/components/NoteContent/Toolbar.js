import React from 'react';
import './NoteContent.css';
import { useSlate } from 'slate-react';
import { toggleBlock, toggleMark, isBlockActive, isMarkActive } from './NoteContent';
import { boldIcon, italicIcon, underlineIcon, heading1Icon, heading2Icon,
  olIcon, ulIcon, blockQuoteIcon, codeIcon, checklistIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';

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
    <BlockButton format="check-list-item" />
  </div>
));

const getFormatInfo = format => {
  switch (format) {
    case 'bold': return [boldIcon, 'Bold', 'ctrl+b'];
    case 'italic': return [italicIcon, 'Italics', 'ctrl+i'];
    case 'underline': return [underlineIcon, 'Underline', 'ctrl+u'];
    case 'code': return [codeIcon, 'Code Block', 'ctrl+`'];
    case 'heading-one': return [heading1Icon, 'Heading 1', 'ctrl+shift+1'];
    case 'heading-two': return [heading2Icon, 'Heading 2', 'ctrl+shift+2'];
    case 'block-quote': return [blockQuoteIcon, 'Block Quote', 'ctrl+shift+3'];
    case 'numbered-list': return [olIcon, 'Numbered List', 'ctrl+shift+4'];
    case 'bulleted-list': return [ulIcon, 'Bulleted List', 'ctrl+shift+5'];
    case 'check-list-item': return [checklistIcon, 'Checkbox', 'ctrl+shift+6'];
    default: return null;
  }
};

const BlockButton = ({ format }) => {
  const editor = useSlate();

  const clickHandler = e => {
    e.preventDefault();
    toggleBlock(editor, format);
  };

  const [icon, text1, text2] = getFormatInfo(format);

  return (
    <div
      onMouseDown={clickHandler}
      className={`Toolbar__btn ${isBlockActive(editor, format) ? 'Toolbar__btn--active' : ''}`}
    >
      {icon}
      <Tooltip position="down">{text1}<div>{text2}</div></Tooltip>
    </div>
  )
};

const MarkButton = ({ format }) => {
  const editor = useSlate();

  const clickHandler = e => {
    e.preventDefault();
    toggleMark(editor, format);
  };

  const [icon, text1, text2] = getFormatInfo(format);

  return (
    <div
      onMouseDown={clickHandler}
      className={`Toolbar__btn ${isMarkActive(editor, format) ? 'Toolbar__btn--active' : ''}`}
    >
      {icon}
      <Tooltip position="down">{text1}<div>{text2}</div></Tooltip>
    </div>
  );
};

export default Toolbar;
