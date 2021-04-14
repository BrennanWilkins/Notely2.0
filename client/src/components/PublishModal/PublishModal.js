import React, { useState } from 'react';
import './PublishModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';
import { sendUpdate } from '../../socket';
import { connect } from 'react-redux';
import { useDidUpdate } from '../../utils/customHooks';
import { selectPublishID } from '../../store/selectors';
import { publishNote, unpublishNote } from '../../store/actions';

const PublishModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState('');

  useDidUpdate(() => {
    props.close();
  }, [props.noteID]);

  const msgHandler = (txt, socket) => {
    setShowMsg(true);
    setIsLoading(false);
    setMsg(txt);
    socket.off('success: put/note/publish');
    socket.off('error: put/note/publish');
  };

  const publishHandler = () => {
    setShowMsg(false);
    if (!props.publishID) {
      const socket = sendUpdate('put/note/publish', { noteID: props.noteID });
      socket.on('success: put/note/publish', ({ publishID }) => {
        msgHandler('Note published! You can visit it using the link below.', socket);
        props.publishNote({ noteID: props.noteID, publishID });
      });
      socket.on('error: put/note/publish', () => {
        msgHandler('There was an error while publishing your note.', socket);
      });
    } else {
      props.unpublishNote(props.noteID);
    }
  };

  return (
    <ModalContainer close={props.close} title="Publish">
      <p className="PublishModal__info">
        Publishing a note will create a public link that will allow anyone with
        your note's link to view your note in a read-only mode.
      </p>
      <button
        disabled={isLoading}
        className="Btn BlueBtn PublishModal__pubBtn"
        onClick={publishHandler}
      >
        {props.publishID ? 'Unpublish Note' : 'Create a public link'}
      </button>
      <div className="PublishModal__msg" style={!showMsg ? {opacity: '0'} : null}>
        {msg}
      </div>
      {!!props.publishID &&
        <label className="PublishModal__link">
          <span>Public Link</span>
          <input
            className="Input"
            readOnly
            onFocus={e => e.target.select()}
            value={`localhost:3000/n/${props.publishID}`}
          />
        </label>
      }
    </ModalContainer>
  );
};

PublishModal.propTypes = {
  close: PropTypes.func.isRequired,
  noteID: PropTypes.string,
  publishID: PropTypes.string,
  publishNote: PropTypes.func.isRequired,
  unpublishNote: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  noteID: state.notes.currentNoteID,
  publishID: selectPublishID(state)
});

const mapDispatchToProps = dispatch => ({
  publishNote: payload => dispatch(publishNote(payload)),
  unpublishNote: noteID => dispatch(unpublishNote(noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(PublishModal);
