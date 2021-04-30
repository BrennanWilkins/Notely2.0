import React from 'react';
import './SideNav.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showNotesByTag } from '../../store/actions';

const SideNavTags = props => {
  const showNotesByTagHandler = tag => {
    props.showNotesByTag(tag);
    props.resetListShown();
    if (props.shown && window.innerWidth <= 750) {
      props.toggleSideNav();
    }
  };

  const keyPressHandler = (e, tag) => {
    if (e.key === 'Enter') {
      showNotesByTagHandler(tag);
    }
  };

  return (
    <div
      className={`
        SideNav__tags
        ${props.showTags ? 'SideNav__tags--show' : 'SideNav__tags--hide'}
      `}
      style={{ maxHeight: props.showTags ? props.tags.length * 42 + 'px' : '0' }}
    >
      {props.tags.map(tag => (
        <div
          className="SideNav__tag"
          key={tag}
          onClick={() => showNotesByTagHandler(tag)}
          tabIndex={props.showTags ? '0' : '-1'}
          onKeyPress={e => keyPressHandler(e, tag)}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

SideNavTags.propTypes = {
  shown: PropTypes.bool.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  showNotesByTag: PropTypes.func.isRequired,
  resetListShown: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  showTags: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  tags: state.notes.allTags
});

const mapDispatchToProps = dispatch => ({
  showNotesByTag: tag => dispatch(showNotesByTag(tag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNavTags);
