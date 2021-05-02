import React, { useState } from 'react';
import './NoteTags.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { xIcon } from '../UI/icons';
import { createTag, removeTag } from '../../store/actions';
import { selectCurrTags } from '../../store/selectors';

const NoteTags = ({ tags, noteID, createTag, removeTag }) => {
  const [newTag, setNewTag] = useState('');

  const changeHandler = e => {
    if (e.target.value.length > 100) { return; }
    setNewTag(e.target.value);
  };

  const keyPressHandler = e => {
    if (e.key === 'Enter') {
      createTag(noteID, newTag);
      setNewTag('');
    }
  };

  return !noteID ? null : (
    <div className="NoteTags">
      {tags.map(tag => (
        <div className="NoteTags__tag" key={tag}>
          <div className="NoteTags__tagTitle">{tag}</div>
          <div
            onClick={() => removeTag(noteID, tag)}
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
  tags: selectCurrTags(state),
  noteID: state.notes.currentNoteID
});

const mapDispatchToProps = dispatch => ({
  createTag: (noteID, tag) => dispatch(createTag(noteID, tag)),
  removeTag: (noteID, tag) => dispatch(removeTag(noteID, tag))
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteTags);
