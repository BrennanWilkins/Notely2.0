import React from 'react';
import './NoteContent.css';
import { useSlate } from 'slate-react';
import { toggleBlock, toggleMark, isBlockActive, isMarkActive } from './NoteEditor';
import { boldIcon, italicIcon, underlineIcon, heading1Icon, heading2Icon,
  olIcon, ulIcon, blockQuoteIcon, codeIcon, checklistIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';
import { LinkButton } from './plugins/withLinks';
import isMac from '../../utils/isMac';

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

const btnKey = isMac ? 'Cmd' : 'Ctrl';
const btnInfo = {
  'bold': { icon: boldIcon, text: 'Bold', subText: `${btnKey}+B` },
  'italic': { icon: italicIcon, text: 'Italics', subText: `${btnKey}+I` },
  'underline': { icon: underlineIcon, text: 'Underline', subText: `${btnKey}+U` },
  'code': { icon: codeIcon, text: 'Code Block', subText: `${btnKey}+\`` },
  'heading-one': { icon: heading1Icon, text: 'Heading 1', subText: `${btnKey}+Shift+1` },
  'heading-two': { icon: heading2Icon, text: 'Heading 2', subText: `${btnKey}+Shift+2` },
  'block-quote': { icon: blockQuoteIcon, text: 'Block Quote', subText: `${btnKey}+Shift+3` },
  'numbered-list': { icon: olIcon, text: 'Numbered List', subText: `${btnKey}+Shift+4` },
  'bulleted-list': { icon: ulIcon, text: 'Bulleted List', subText: `${btnKey}+Shift+5` },
  'check-list-item': { icon: checklistIcon, text: 'Checkbox', subText: `${btnKey}+Shift+6` },
};

const BlockButton = ({ format }) => {
  const editor = useSlate();
  const { icon, text, subText } = btnInfo[format];

  const clickHandler = e => {
    e.preventDefault();
    toggleBlock(editor, format);
  };

  return (
    <div
      onMouseDown={clickHandler}
      className={`Toolbar__btn ${isBlockActive(editor, format) ? 'Toolbar__btn--hl' : ''}`}
    >
      {icon}
      <Tooltip position="down">
        {text}<div>{subText}</div>
      </Tooltip>
    </div>
  )
};

const MarkButton = ({ format }) => {
  const editor = useSlate();
  const { icon, text, subText } = btnInfo[format];

  const clickHandler = e => {
    e.preventDefault();
    toggleMark(editor, format);
  };

  return (
    <div
      onMouseDown={clickHandler}
      className={`Toolbar__btn ${isMarkActive(editor, format) ? 'Toolbar__btn--hl' : ''}`}
    >
      {icon}
      <Tooltip position="down">
        {text}<div>{subText}</div>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
