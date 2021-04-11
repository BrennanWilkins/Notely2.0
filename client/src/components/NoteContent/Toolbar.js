import React, { useMemo } from 'react';
import './NoteContent.css';
import { useSlate } from 'slate-react';
import { toggleBlock, toggleMark, isBlockActive, isMarkActive } from './NoteEditor';
import { boldIcon, italicIcon, underlineIcon, heading1Icon, heading2Icon,
  olIcon, ulIcon, blockQuoteIcon, codeIcon, checklistIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';
import { LinkButton } from './plugins/withLinks';

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
    <LinkButton />
  </div>
));

const getFormatInfo = format => {
  switch (format) {
    case 'bold': return [boldIcon, 'Bold', 'Ctrl+B'];
    case 'italic': return [italicIcon, 'Italics', 'Ctrl+I'];
    case 'underline': return [underlineIcon, 'Underline', 'Ctrl+U'];
    case 'code': return [codeIcon, 'Code Block', 'Ctrl+`'];
    case 'heading-one': return [heading1Icon, 'Heading 1', 'Ctrl+Shift+1'];
    case 'heading-two': return [heading2Icon, 'Heading 2', 'Ctrl+Shift+2'];
    case 'block-quote': return [blockQuoteIcon, 'Block Quote', 'Ctrl+Shift+3'];
    case 'numbered-list': return [olIcon, 'Numbered List', 'Ctrl+Shift+4'];
    case 'bulleted-list': return [ulIcon, 'Bulleted List', 'Ctrl+Shift+5'];
    case 'check-list-item': return [checklistIcon, 'Checkbox', 'Ctrl+Shift+6'];
    default: return null;
  }
};

const BlockButton = ({ format }) => {
  const editor = useSlate();
  const [icon, text1, text2] = useMemo(() => getFormatInfo(format), [format]);

  const clickHandler = e => {
    e.preventDefault();
    toggleBlock(editor, format);
  };

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
  const [icon, text1, text2] = useMemo(() => getFormatInfo(format), [format]);

  const clickHandler = e => {
    e.preventDefault();
    toggleMark(editor, format);
  };

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
