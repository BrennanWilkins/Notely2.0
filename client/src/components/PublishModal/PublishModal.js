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

const PublishModal = ({ noteID, close, pubID, publishNote, unpublishNote }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msg, setMsg] = useState('');

  useDidUpdate(() => {
    close();
  }, [noteID]);

  useDidUpdate(() => {
    if (!pubID && showMsg) { setShowMsg(false); }
  }, [pubID]);

  const msgHandler = txt => {
    setShowMsg(true);
    setIsLoading(false);
    setMsg(txt);
  };

  const publishHandler = () => {
    setShowMsg(false);
    if (!pubID) {
      sendUpdate('put/note/publish', { noteID }, res => {
        if (res.error) {
          return msgHandler('There was an error while publishing your note.');
        }
        msgHandler('Note published! You can visit it using the link below.');
        publishNote({ noteID, publishID: res.publishID });
      });
    } else {
      unpublishNote(noteID);
    }
  };

  return (
    <ModalContainer close={close} title="Publish">
      <p className="PublishModal__info">
        Publishing a note will create a public link that will allow anyone with
        your note's link to view your note in a read-only mode.
      </p>
      <button
        disabled={isLoading}
        className="Btn BlueBtn PublishModal__pubBtn"
        onClick={publishHandler}
      >
        {pubID ? 'Unpublish Note' : 'Create a public link'}
      </button>
      <div className="PublishModal__msg" style={!showMsg ? {opacity: '0'} : null}>
        {msg}
      </div>
      {!!pubID &&
        <div className="PublishModal__link">
          <label>
            Public Link
            <input
              className="Input"
              readOnly
              onFocus={e => e.target.select()}
              value={`${baseURL}/n/${pubID}`}
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
  pubID: PropTypes.string,
  publishNote: PropTypes.func.isRequired,
  unpublishNote: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  noteID: state.notes.currentNoteID,
  pubID: selectPublishID(state)
});

const mapDispatchToProps = dispatch => ({
  publishNote: payload => dispatch(publishNote(payload)),
  unpublishNote: noteID => dispatch(unpublishNote(noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(PublishModal);
