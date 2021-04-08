import React, { useMemo, useState, useEffect, useRef } from 'react';
import './NoteContent.css';
import PropTypes from 'prop-types';
import { withReact, Slate } from 'slate-react';
import { Editor, createEditor } from 'slate';
import { withHistory, HistoryEditor } from 'slate-history';
import Toolbar from './Toolbar';
import { connect } from 'react-redux';
import { updateNote, setStatus } from '../../store/actions';
import { logo } from '../UI/icons';
import { sendUpdate } from '../../socket';
import NoteEditor from './NoteEditor';
import { OP_TYPES } from './constants';
import withChecklists from './plugins/withChecklists';

const NoteContent = props => {
  const [value, setValue] = useState(props.currentBody);
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

  return (
    props.currentNoteID ?
      <div className="NoteContent">
        <Slate editor={editor} value={value} onChange={changeHandler}>
          <Toolbar />
          <NoteEditor editor={editor} />
        </Slate>
      </div>
    :
      <div className="NoteContent NoteContent--empty">
        <div className="NoteContent__logo">{logo}</div>
      </div>
  );
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
