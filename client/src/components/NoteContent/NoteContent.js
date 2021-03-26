import React, { useCallback, useMemo, useState, useEffect } from 'react';
import './NoteContent.css';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate } from 'slate-react';
import { Editor, Point, Range, Transforms, createEditor, Element as SlateElement } from 'slate';
import { withHistory } from 'slate-history';
import Toolbar from './Toolbar';
import ChecklistItemElement from './ChecklistItem';
import { connect } from 'react-redux';
import { joinNote } from '../../socket';
import { updateNote } from '../../store/actions';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const MARK_HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code'
};

const BLOCK_HOTKEYS = {
  'mod+shift+1': 'heading-one',
  'mod+shift+2': 'heading-two',
  'mod+shift+3': 'block-quote',
  'mod+shift+4': 'numbered-list',
  'mod+shift+5': 'bulleted-list',
  'mod+shift+6': 'check-list-item'
};

const NoteContent = props => {
  const [value, setValue] = useState(props.currentNote.body);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withChecklists(withHistory(withReact(createEditor()))), []);

  useEffect(() => {
    if (!props.currentNote.noteID) { return; }
    if (value !== props.currentNote.body) {
      setValue(props.currentNote.body);
    }

    joinNote(props.currentNote.noteID);
  }, [props.currentNote.noteID]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (value === props.currentNote.body || !props.currentNote.noteID) { return; }
      props.updateNote(props.currentNote.noteID, value);
    }, 1500);

    return () => clearTimeout(delay);
  }, [value]);

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
      return <ChecklistItemElement {...props} />;
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

const withChecklists = editor => {
  const { deleteBackward } = editor;
  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === 'check-list-item'
      });

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          const newProperties = { type: 'paragraph' };
          Transforms.setNodes(editor, newProperties, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'check-list-item'
          })
          return;
        }
      }
    }
    deleteBackward(...args);
  }

  return editor;
};

NoteContent.propTypes = {
  currentNote: PropTypes.object.isRequired,
  updateNote: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentNote: state.notes.currentNote
});

const mapDispatchToProps = dispatch => ({
  updateNote: (noteID, body) => dispatch(updateNote(noteID, body))
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(NoteContent));

export { toggleBlock, toggleMark, isBlockActive, isMarkActive };
