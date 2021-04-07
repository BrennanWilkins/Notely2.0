import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './NoteMenu.css';
import { connect } from 'react-redux';
import Avatar from '../UI/Avatar/Avatar';
import { getConnectedUsers } from '../../store/actions';
import { sendUpdate } from '../../socket';

const NoteCollaborators = props => {
  const prevNoteID = useRef(null);

  useEffect(() => {
    if (props.noteID) {
      props.getUsers(props.noteID);
      prevNoteID.current = props.noteID;
    } else if (!props.noteID && prevNoteID.current) {
      // notify users before leaving note
      sendUpdate('send inactive', prevNoteID.current);
      prevNoteID.current = null;
    }
  }, [props.noteID]);

  useEffect(() => {
    return () => {
      if (prevNoteID.current) {
        sendUpdate('send inactive', prevNoteID.current);
      }
    };
  }, []);

  return (
    <div className="NoteMenu__collabs">
      {props.collaborators.map(username => {
        const user = props.collabsByName[username];
        return (
          <Avatar
            key={username}
            color={user.color || '#ddd'}
            username={username}
            status={
              (user.noteID === props.noteID || props.username === username) ? 'Active' :
              user.isOnline ? 'Inactive' :
              'Offline'
            }
          />
        );
      })}
    </div>
  );
};

NoteCollaborators.propTypes = {
  collaborators: PropTypes.array.isRequired,
  collabsByName: PropTypes.object.isRequired,
  noteID: PropTypes.string.isRequired,
  getUsers: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  collaborators: state.notes.notesByID[state.notes.currentNoteID].collaborators,
  collabsByName: state.notes.collabsByName,
  noteID: state.notes.currentNoteID,
  username: state.user.username
});

const mapDispatchToProps = dispatch => ({
  getUsers: noteID => dispatch(getConnectedUsers(noteID))
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteCollaborators);
