import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import './NoteContent.css';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate } from 'slate-react';
import { Editor, Point, Range, Transforms, createEditor, Element as SlateElement } from 'slate';
import { withHistory, HistoryEditor } from 'slate-history';
import Toolbar from './Toolbar';
import ChecklistItemElement from './ChecklistItem';
import { connect } from 'react-redux';
import { updateNote, setStatus } from '../../store/actions';
import { logo } from '../UI/icons';
import { sendUpdate } from '../../socket';
import { LIST_TYPES, MARK_HOTKEYS, BLOCK_HOTKEYS, OP_TYPES } from './constants';

const NoteContent = props => {
  const [value, setValue] = useState(props.currentBody);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withChecklists(withHistory(withReact(createEditor()))), []);
  const isRemoteChange = useRef(false);
  const hasChanged = useRef(false);
  const wasRemote = useRef(false);
  const prevNoteID = useRef(null);

  useEffect(() => {
    setValue(props.currentBody);
    // reset history
    editor.history = {
      redos: [],
      undos: []
    };

    // leaving editor, notify collabs user is leaving
    if (!props.currentNoteID && prevNoteID.current) {
      const socket = sendUpdate('leave editor');
      socket.off('receive ops');
      prevNoteID.current = null;
      return;
    }

    const socket = sendUpdate('join editor', props.currentNoteID);
    prevNoteID.current = props.currentNoteID;

    socket.on('receive ops', data => {
      if (data.noteID !== props.currentNoteID || !data.ops || !Array.isArray(data.ops)) { return; }
      isRemoteChange.current = true;
      // prevent normalizing to stop split_node bug
      // uses withoutSaving to not populate user's history with other users
      Editor.withoutNormalizing(editor, () => {
        HistoryEditor.withoutSaving(editor, () => {
          data.ops.forEach(op => {
            if (!OP_TYPES[op.type]) { return; }
            editor.apply(op);
          });
        });
      });
      isRemoteChange.current = false;
      hasChanged.current = true;
      wasRemote.current = true;
    });
  }, [props.currentNoteID]);

  useEffect(() => {
    if (!props.currentNoteID || value === props.currentBody ||
      isRemoteChange.current || hasChanged.current) { return; }
    if (wasRemote.current) {
      return wasRemote.current = false;
    }
    props.updateNote(props.currentNoteID, value);
    props.setStatus();
    // save changes to DB 700ms after stop typing
    const delay = setTimeout(() => {
      if (!props.currentNoteID || isRemoteChange.current) { return; }
      sendUpdate('put/note/save', { noteID: props.currentNoteID, body: value });
    }, 700);

    return () => clearTimeout(delay);
  }, [value]);

  const changeHandler = val => {
    setValue(val);
    const ops = editor.operations;
    if (props.currentNoteID && ops.length && !isRemoteChange.current && !hasChanged.current) {
      const sendOps = ops.filter(op => op && OP_TYPES[op.type]);
      if (sendOps.length) {
        sendUpdate('send ops', { noteID: props.currentNoteID, ops: sendOps });
      }
    }
    hasChanged.current = false;
  };

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
    props.currentNoteID ?
      <div className="NoteContent">
        <Slate editor={editor} value={value} onChange={changeHandler}>
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
    :
      <div className="NoteContent NoteContent--empty">
        <div className="NoteContent__logo">{logo}</div>
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
  currentBody: PropTypes.array.isRequired,
  currentNoteID: PropTypes.string,
  updateNote: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentNoteID: state.notes.currentNoteID,
  currentBody: state.notes.currentNoteID ? state.notes.notesByID[state.notes.currentNoteID].body : []
});

const mapDispatchToProps = dispatch => ({
  updateNote: (noteID, body) => dispatch(updateNote(noteID, body)),
  setStatus: () => dispatch(setStatus(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(NoteContent));

export { toggleBlock, toggleMark, isBlockActive, isMarkActive };
