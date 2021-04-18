import React, { useState } from 'react';
import './PublishModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';
import { sendUpdate } from '../../socket';
import { connect } from 'react-redux';
import { useDidUpdate } from '../../utils/customHooks';
import { selectPublishID } from '../../store/selectors';
import { publishNote, unpublishNote } from '../../store/actions';
import { baseURL } from '../../axios';

const PublishModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState('');

  useDidUpdate(() => {
    props.close();
  }, [props.noteID]);

  useDidUpdate(() => {
    if (!props.publishID && showMsg) { setShowMsg(false); }
  }, [props.publishID]);

  const msgHandler = (txt, socket) => {
    setShowMsg(true);
    setIsLoading(false);
    setMsg(txt);
  };

  const publishHandler = () => {
    setShowMsg(false);
    if (!props.publishID) {
      sendUpdate('put/note/publish', { noteID: props.noteID }, res => {
        if (res.error) {
          return msgHandler('There was an error while publishing your note.');
        }
        msgHandler('Note published! You can visit it using the link below.');
        props.publishNote({ noteID: props.noteID, publishID: res.publishID });
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
        <div className="PublishModal__link">
          <label>
            Public Link
            <input
              className="Input"
              readOnly
              onFocus={e => e.target.select()}
              value={`${baseURL}/n/${props.publishID}`}
            />
          </label>
        </div>
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
