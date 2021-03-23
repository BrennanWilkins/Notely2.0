import React, { useCallback, useMemo, useState } from 'react';
import './NoteContent.css';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { Editor, Transforms, createEditor, Descendant, Node, Element as SlateElement } from 'slate';
import { withHistory } from 'slate-history';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code'
};

const NoteContent = () => {
  const [value, setValue] = useState(initialValue);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const keyDownHandler = e => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, e)) {
        e.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
      }
    }
  };

  return (
    <div className="NoteContent">
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <Toolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Start here"
          spellCheck
          autoFocus
          onKeyDown={keyDownHandler}
        />
      </Slate>
    </div>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true,
  });
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

const Toolbar = React.memo(() => (
  <div className="NoteContent__toolbar">
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

const BlockButton = ({ format }) => {
  const editor = useSlate();

  const clickHandler = e => {
    e.preventDefault();
    toggleBlock(editor, format);
  };

  return (
    <div
      onMouseDown={clickHandler}
      className={`NoteContent__toolbarBtn ${isBlockActive(editor, format) ? 'NoteContent__toolbarBtn--active' : ''}`}
    >
      {format}
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
      className={`NoteContent__toolbarBtn ${isBlockActive(editor, format) ? 'NoteContent__toolbarBtn--active' : ''}`}
    >
      {format}
    </div>
  );
};

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  }
];

export default NoteContent;
