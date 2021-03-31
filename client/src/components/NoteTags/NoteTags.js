import React, { useState } from 'react';
import './NoteTags.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { xIcon } from '../UI/icons';
import { createTag, removeTag } from '../../store/actions';

const NoteTags = props => {
  const [newTag, setNewTag] = useState('');

  const changeHandler = e => {
    if (e.target.value.length > 100) { return; }
    setNewTag(e.target.value);
  };

  const keyPressHandler = e => {
    if (e.key === 'Enter') {
      props.createTag(props.noteID, newTag);
      setNewTag('');
    }
  };

  return !props.noteID ? null : (
    <div className="NoteTags">
      {props.tags.map(tag => (
        <div className="NoteTags__tag" key={tag}>
          <div className="NoteTags__tagTitle">{tag}</div>
          <div
            onClick={() => props.removeTag(props.noteID, tag)}
            className="NoteTags__deleteBtn"
          >
            {xIcon}
          </div>
        </div>
      ))}
      <input
        className="NoteTags__input"
        value={newTag}
        onChange={changeHandler}
        placeholder="Add a tag"
        onKeyPress={keyPressHandler}
      />
    </div>
  );
};

NoteTags.propTypes = {
  tags: PropTypes.array.isRequired,
  createTag: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  noteID: PropTypes.string
};

const mapStateToProps = state => ({
  tags: state.notes.currentNoteID ? state.notes.notesByID[state.notes.currentNoteID].tags : [],
  noteID: state.notes.currentNoteID
});

const mapDispatchToProps = dispatch => ({
  createTag: (noteID, tag) => dispatch(createTag(noteID, tag)),
  removeTag: (noteID, tag) => dispatch(removeTag(noteID, tag))
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteTags);
