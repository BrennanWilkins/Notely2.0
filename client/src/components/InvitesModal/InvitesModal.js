import React, { useState } from 'react';
import './InvitesModal.css';
import PropTypes from 'prop-types';
import ModalContainer from '../UI/ModalContainer/ModalContainer';
import { connect } from 'react-redux';
import { eyeIcon } from '../UI/icons';
import NotePreview from '../NotePreview/NotePreview';
import { acceptInvite, rejectInvite } from '../../store/actions';

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
                  <button
                    className="Btn BlueBtn InvitesModal__accBtn"
                    onClick={() => props.acceptInvite(noteID)}
                  >
                    Accept
                  </button>
                  <button
                    className="Btn BlueBtn InvitesModal__rejBtn"
                    onClick={() => props.rejectInvite(noteID)}
                  >
                    Reject
                  </button>
                  <button
                    className="Btn BlueBtn InvitesModal__prevBtn"
                    onClick={() => setShownPreview(noteID)}
                  >
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
  invites: PropTypes.array.isRequired,
  acceptInvite: PropTypes.func.isRequired,
  rejectInvite: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  invites: state.user.invites
});

const mapDispatchToProps = dispatch => ({
  acceptInvite: noteID => dispatch(acceptInvite(noteID)),
  rejectInvite: noteID => dispatch(rejectInvite(noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(InvitesModal);
