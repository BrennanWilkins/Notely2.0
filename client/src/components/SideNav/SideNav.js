import React, { useState, useRef, useEffect } from 'react';
import './SideNav.css';
import PropTypes from 'prop-types';
import ToggleSideNavBtn from '../UI/ToggleSideNavBtn/ToggleSideNavBtn';
import { logo, notesIcon, trashIcon, settingsIcon, tagsIcon, backIcon, peopleIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { toggleSideNav, setShowTrash, showNotesByTag, setListShown } from '../../store/actions';
import SettingsModal from '../SettingsModal/SettingsModal';
import Tooltip from '../UI/Tooltip/Tooltip';
import InvitesModal from '../InvitesModal/InvitesModal';
import SearchBar from '../SearchBar/SearchBar';

const SideNav = props => {
  const [showSettings, setShowSettings] = useState(false);
  const [showInvitesModal, setShowInvitesModal] = useState(false);
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
    if (!props.sideNavShown && showTags) {
      setShowTags(false);
    }

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

  const resetListShown = () => {
    if (window.innerWidth <= 750) {
      props.setListShown(true);
    }
  };

  const toggleTrashHandler = bool => {
    props.setShowTrash(bool);
    resetListShown();
  };

  const showNotesByTagHandler = tag => {
    props.showNotesByTag(tag);
    resetListShown();
    if (props.sideNavShown && window.innerWidth <= 750) {
      props.toggleSideNav();
    }
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
          <SearchBar sideNavShown={props.sideNavShown} toggleSideNav={props.toggleSideNav} />
          <div className="SideNav__link" onClick={() => toggleTrashHandler(false)}>
            <div className="SideNav__innerLink">
              {notesIcon}
              <div>All Notes</div>
            </div>
            {!props.sideNavShown && <Tooltip position="right">All Notes</Tooltip>}
          </div>
          <div className="SideNav__link" onClick={() => toggleTrashHandler(true)}>
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
          <div className="SideNav__link" onClick={() => setShowInvitesModal(true)}>
            <div className="SideNav__innerLink">
              {peopleIcon}
              <div>
                Invites
                {props.hasInvites && <span className="SideNav__notif" />}
              </div>
            </div>
            {!props.sideNavShown && <Tooltip position="right">Invites</Tooltip>}
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
          <div
            className={`SideNav__tags ${showTags ? 'SideNav__tags--show' : 'SideNav__tags--hide'}`}
            style={{ maxHeight: showTags ? props.tags.length * 42 + 'px' : '0' }}
          >
            {props.tags.map(tag => (
              <div className="SideNav__tag" key={tag} onClick={() => showNotesByTagHandler(tag)}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
      {showSettings && <SettingsModal close={() => setShowSettings(false)} />}
      {showInvitesModal && <InvitesModal close={() => setShowInvitesModal(false)} />}
    </>
  );
};

SideNav.propTypes = {
  sideNavShown: PropTypes.bool.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  setShowTrash: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  showNotesByTag: PropTypes.func.isRequired,
  setListShown: PropTypes.func.isRequired,
  hasInvites: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  sideNavShown: state.ui.sideNavShown,
  tags: state.notes.allTags,
  hasInvites: state.user.invites.length > 0
});

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav()),
  setShowTrash: bool => dispatch(setShowTrash(bool)),
  showNotesByTag: tag => dispatch(showNotesByTag(tag)),
  setListShown: bool => dispatch(setListShown(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
