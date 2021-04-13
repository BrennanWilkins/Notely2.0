import React from 'react';
import PropTypes from 'prop-types';
import './NoteMenu.css';
import { connect } from 'react-redux';
import Avatar from '../UI/Avatar/Avatar';
import { selectCurrCollabs } from '../../store/selectors';

const NoteCollaborators = props => (
  <div className="NoteMenu__collabs">
    {props.collaborators.map(username => {
      const user = props.collabsByName[username];
      return (
        <Avatar
          key={username}
          color={user.color || '#ddd'}
          username={username}
          status={
            user.isActive ? 'Active' :
            user.isOnline ? 'Inactive' :
            'Offline'
          }
        />
      );
    })}
  </div>
);

NoteCollaborators.propTypes = {
  collaborators: PropTypes.array.isRequired,
  collabsByName: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  collaborators: selectCurrCollabs(state),
  collabsByName: state.notes.collabsByName
});

export default connect(mapStateToProps)(NoteCollaborators);
