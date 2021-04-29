import React, { useState, useRef, useEffect } from 'react';
import './SideNav.css';
import PropTypes from 'prop-types';
import ToggleSideNavBtn from '../UI/ToggleSideNavBtn/ToggleSideNavBtn';
import { logo, notesIcon, trashIcon, settingsIcon, tagsIcon, backIcon,
  peopleIcon, personIcon, helpIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { toggleSideNav, setShowTrash, setListShown } from '../../store/actions';
import SettingsModal from '../SettingsModal/SettingsModal';
import Tooltip from '../UI/Tooltip/Tooltip';
import InvitesModal from '../InvitesModal/InvitesModal';
import SearchBar from '../SearchBar/SearchBar';
import AccountModal from '../AccountModal/AccountModal';
import { Link } from 'react-router-dom';
import SideNavTags from './SideNavTags';

const SideNav = props => {
  const [showSettings, setShowSettings] = useState(false);
  const [showInvitesModal, setShowInvitesModal] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showAccnt, setShowAccnt] = useState(false);
  const sideNavRef = useRef();

  useEffect(() => {
    const clickHandler = e => {
      if (props.shown && !sideNavRef.current.contains(e.target)) {
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

    if (props.shown) { resizeHandler(); }
    if (!props.shown && showTags) {
      setShowTags(false);
    }

    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
      document.removeEventListener('mousedown', clickHandler);
    };
  }, [props.shown]);

  const toggleTagsHandler = () => {
    if (!props.shown) {
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

  return (
    <>
      <div ref={sideNavRef} className={`SideNav ${props.shown ? 'SideNav--expand' : 'SideNav--contract'}`}>
        <ToggleSideNavBtn isExpanded={props.shown} onClick={props.toggleSideNav} />
        <div className="SideNav__title">
          {logo}
          <div>Notely</div>
        </div>
        <SearchBar isExpanded={props.shown} toggleSideNav={props.toggleSideNav} />
        <div className="SideNav__container">
          <SideNavLink
            onClick={() => toggleTrashHandler(false)}
            title="All Notes"
            icon={notesIcon}
          />
          <SideNavLink
            onClick={() => toggleTrashHandler(true)}
            title="Trash"
            icon={trashIcon}
          />
          <SideNavLink
            onClick={() => setShowSettings(true)}
            title="Settings"
            icon={settingsIcon}
          />
          <SideNavLink
            onClick={() => setShowAccnt(true)}
            title="Account"
            icon={personIcon}
          />
          <SideNavLink
            onClick={() => setShowInvitesModal(true)}
            title="Invites"
            icon={peopleIcon}
          >
            <div>
              Invites
              {props.hasInvites && <span className="SideNav__notif" />}
            </div>
          </SideNavLink>
          <SideNavLink
            onClick={toggleTagsHandler}
            title="Tags"
            icon={tagsIcon}
          >
            <div>Tags</div>
            <span className={`SideNav__toggleTagBtn ${showTags ? 'SideNav__toggleTagBtn--rotate' : ''}`}>
              {backIcon}
            </span>
          </SideNavLink>
          <SideNavTags
            showTags={showTags}
            shown={props.shown}
            toggleSideNav={props.toggleSideNav}
            resetListShown={resetListShown}
          />
        </div>
        <Link to="/help" className="SideNav__link SideNav__helpLink">
          <div className="SideNav__innerLink">
            {helpIcon}
            <div>Help</div>
          </div>
          {!props.shown && <Tooltip position="right">Help</Tooltip>}
        </Link>
      </div>
      {showAccnt && <AccountModal close={() => setShowAccnt(false)} />}
      {showSettings && <SettingsModal close={() => setShowSettings(false)} />}
      {showInvitesModal && <InvitesModal close={() => setShowInvitesModal(false)} />}
    </>
  );
};

const SideNavLink = (
  connect(state => ({ shown: state.ui.sideNavShown }))
  (({ onClick, title, icon, children, shown }) => (
    <div className="SideNav__link" onClick={onClick}>
      <div className="SideNav__innerLink">
        {icon}
        {children || <div>{title}</div>}
      </div>
      {!shown && <Tooltip position="right">{title}</Tooltip>}
    </div>
)));

SideNav.propTypes = {
  shown: PropTypes.bool.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  setShowTrash: PropTypes.func.isRequired,
  setListShown: PropTypes.func.isRequired,
  hasInvites: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  shown: state.ui.sideNavShown,
  hasInvites: state.user.invites.length > 0
});

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav()),
  setShowTrash: bool => dispatch(setShowTrash(bool)),
  setListShown: bool => dispatch(setListShown(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
