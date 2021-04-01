import React, { useState, useRef, useEffect } from 'react';
import './SideNav.css';
import PropTypes from 'prop-types';
import ToggleSideNavBtn from '../UI/ToggleSideNavBtn/ToggleSideNavBtn';
import { logo, notesIcon, trashIcon, settingsIcon, tagsIcon, backIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { toggleSideNav, setShowTrash, showNotesByTag } from '../../store/actions';
import SettingsModal from '../SettingsModal/SettingsModal';
import Tooltip from '../UI/Tooltip/Tooltip';

const SideNav = props => {
  const [showSettings, setShowSettings] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const sideNavRef = useRef();

  useEffect(() => {
    const clickHandler = e => {
      if (props.sideNavShown && !sideNavRef.current.contains(e.target)) {
        props.toggleSideNav();
      }
    };

    const resizeHandler = () => {
      if (window.innerWidth <= 900) {
        document.addEventListener('mousedown', clickHandler);
      } else {
        document.removeEventListener('mousedown', clickHandler);
      }
    };

    if (props.sideNavShown) { resizeHandler(); }

    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
      document.removeEventListener('mousedown', clickHandler);
    };
  }, [props.sideNavShown]);

  const toggleTagsHandler = () => {
    if (!props.sideNavShown) {
      props.toggleSideNav();
    }
    setShowTags(shown => !shown);
  };

  return (
    <>
      <div ref={sideNavRef} className={`SideNav ${props.sideNavShown ? 'SideNav--expand' : 'SideNav--contract'}`}>
        <ToggleSideNavBtn isExpanded={props.sideNavShown} onClick={props.toggleSideNav} />
        <div className="SideNav__title">
          {logo}
          <div>Notely</div>
        </div>
        <div className="SideNav__container">
          <div className="SideNav__link" onClick={() => props.setShowTrash(false)}>
            <div className="SideNav__innerLink">
              {notesIcon}
              <div>All Notes</div>
            </div>
            {!props.sideNavShown && <Tooltip position="right">All Notes</Tooltip>}
          </div>
          <div className="SideNav__link" onClick={() => props.setShowTrash(true)}>
            <div className="SideNav__innerLink">
              {trashIcon}
              <div>Trash</div>
            </div>
            {!props.sideNavShown && <Tooltip position="right">Trash</Tooltip>}
          </div>
          <div className="SideNav__link" onClick={() => setShowSettings(true)}>
            <div className="SideNav__innerLink">
              {settingsIcon}
              <div>Settings</div>
            </div>
            {!props.sideNavShown && <Tooltip position="right">Settings</Tooltip>}
          </div>
          <div className="SideNav__link" onClick={toggleTagsHandler}>
            <div className="SideNav__innerLink">
              {tagsIcon}
              <div>Tags</div>
              <span className={`SideNav__toggleTagBtn ${showTags ? 'SideNav__toggleTagBtn--rotate' : ''}`}>
                {backIcon}
              </span>
            </div>
            {!props.sideNavShown && <Tooltip position="right">Tags</Tooltip>}
          </div>
        </div>
        <div
          className={`SideNav__tags ${showTags ? 'SideNav__tags--show' : 'SideNav__tags--hide'}`} 
          style={{ maxHeight: showTags ? props.tags.length * 42 + 'px' : '0' }}
        >
          {props.tags.map(tag => (
            <div className="SideNav__tag" key={tag} onClick={() => props.showNotesByTag(tag)}>
              {tag}
            </div>
          ))}
        </div>
      </div>
      {showSettings && <SettingsModal close={() => setShowSettings(false)} />}
    </>
  );
};

SideNav.propTypes = {
  sideNavShown: PropTypes.bool.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  setShowTrash: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  showNotesByTag: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  sideNavShown: state.ui.sideNavShown,
  tags: state.notes.allTags
});

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav()),
  setShowTrash: bool => dispatch(setShowTrash(bool)),
  showNotesByTag: tag => dispatch(showNotesByTag(tag))
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
