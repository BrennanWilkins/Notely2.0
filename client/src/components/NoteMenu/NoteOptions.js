import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './NoteMenu.css';
import { useModalToggle } from '../../utils/customHooks';
import { downloadCurrNote } from '../../utils/downloadNotes';
import { copyNote } from '../../store/actions';
import { connect } from 'react-redux';

const NoteOptions = ({ close, copyNote }) => {
  const modalRef = useRef();
  useModalToggle(modalRef, close);

  const keyPressHandler = e => {
    if (e.key === 'Enter') {
      e.currentTarget.click();
    }
  };

  return (
    <div ref={modalRef} className="NoteMenu__optModal">
      <div
        onClick={() => window.print()}
        tabIndex="0"
        onKeyPress={keyPressHandler}
      >
        Print Note
      </div>
      <div
        onClick={() => downloadCurrNote()}
        tabIndex="0"
        onKeyPress={keyPressHandler}
      >
        Export Note
      </div>
      <div
        onClick={() => copyNote()}
        tabIndex="0"
        onKeyPress={keyPressHandler}
      >
        Copy Note
      </div>
    </div>
  );
};

NoteOptions.propTypes = {
  close: PropTypes.func.isRequired,
  copyNote: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  copyNote: () => dispatch(copyNote())
});

export default connect(null, mapDispatchToProps)(NoteOptions);
