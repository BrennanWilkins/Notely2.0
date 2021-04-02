import React, { useState } from 'react';
import './InvitesModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';
import { connect } from 'react-redux';
import { eyeIcon } from '../UI/icons';
import NotePreview from '../NotePreview/NotePreview';

const InvitesModal = props => {
  const [shownPreview, setShownPreview] = useState('');

  return (
    <ModalContainer close={props.close} title="Invites" className="InvitesModalContainer">
      {props.invites.length ?
        <>
          <div className="InvitesModal__title">
            Inviter Username
          </div>
          {props.invites.map(({ inviter, noteID }) => (
            <React.Fragment key={noteID}>
              <div className="InvitesModal__invite">
                <div className="InvitesModal__inviter">{inviter}</div>
                <div className="InvitesModal__actions">
                  <button className="InvitesModal__accBtn">Accept</button>
                  <button className="InvitesModal__rejBtn">Reject</button>
                  <button className="InvitesModal__prevBtn" onClick={() => setShownPreview(noteID)}>
                    Preview Note{eyeIcon}
                  </button>
                </div>
              </div>
              {shownPreview === noteID && <NotePreview noteID={noteID} close={() => setShownPreview('')} />}
            </React.Fragment>
          ))}
        </>
        :
        <div className="InvitesModal__noInvites">
          You do not have any note invites.
        </div>
      }
    </ModalContainer>
  );
};

InvitesModal.propTypes = {
  close: PropTypes.func.isRequired,
  invites: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  invites: state.user.invites
});

export default connect(mapStateToProps)(InvitesModal);
