import React, { useState, useMemo, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import './NotePreview.css';
import PropTypes from 'prop-types';
import { CloseBtn } from '../UI/Buttons/Buttons';
import { sendUpdate } from '../../socket';
import SimpleSpinner from '../UI/SimpleSpinner/SimpleSpinner';

const NotePreview = props => {
  const [value, setValue] = useState([]);
  const editor = useMemo(() => withReact(createEditor()), []);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    const socket = sendUpdate('get/note/invite', { noteID: props.noteID });

    socket.on('success: get/note/invite', data => {
      socket.off('success: get/note/invite');
      socket.off('error: get/note/invite');
      const { body } = data;
      setValue(body);
      setIsLoading(false);
      setErr(false);
    });

    socket.on('error: get/note/invite', msg => {
      socket.off('success: get/note/invite');
      socket.off('error: get/note/invite');
      setErr(true);
      setIsLoading(false);
    });
  }, [props.noteID]);

  return (
    <div className="NotePreview">
      <CloseBtn className="NotePreview__closeBtn" onClick={props.close} />
      <div className="NotePreview__slate">
        {
          err ?
            <div className="NotePreview__errMsg">
              There was an error while retrieving the note preview.
            </div>
          : isLoading ?
            <SimpleSpinner className="NotePreview__spinner" />
          :
            <Slate editor={editor} value={value} onChange={value => setValue(value)}>
              <Editable readOnly placeholder="Empty Note" />
            </Slate>
        }
      </div>
    </div>
  );
};

NotePreview.propTypes = {
  close: PropTypes.func.isRequired,
  noteID: PropTypes.string.isRequired
};

export default NotePreview;
