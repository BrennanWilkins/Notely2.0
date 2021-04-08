import React, { useCallback } from 'react';
import './NoteContent.css';
import { Editable } from 'slate-react';
import isHotkey from 'is-hotkey';
import { LIST_TYPES, MARK_HOTKEYS, BLOCK_HOTKEYS } from './constants';
import { Editor, Transforms, Element as SlateElement } from 'slate';
import { ChecklistItem } from './plugins/withChecklists';

const NoteEditor = ({ editor }) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);

  const keyDownHandler = e => {
    for (const hotkey in MARK_HOTKEYS) {
      if (isHotkey(hotkey, e)) {
        e.preventDefault();
        toggleMark(editor, MARK_HOTKEYS[hotkey]);
      }
    }
    for (const hotkey in BLOCK_HOTKEYS) {
      if (isHotkey(hotkey, e)) {
        e.preventDefault();
        toggleBlock(editor, BLOCK_HOTKEYS[hotkey]);
      }
    }
  };

  return (
    <Editable
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder="Start here"
      spellCheck
      autoFocus
      onKeyDown={keyDownHandler}
    />
  )
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

const Element = props => {
  const { attributes, children, element } = props;
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
    case 'check-list-item':
      return <ChecklistItem {...props} />;
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


export default NoteEditor;
export { toggleBlock, toggleMark, isBlockActive, isMarkActive };
