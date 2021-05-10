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

const SideNav = ({
  shown,
  toggleSideNav,
  setShowTrash,
  setListShown,
  hasInvites
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showInvitesModal, setShowInvitesModal] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showAccnt, setShowAccnt] = useState(false);
  const sideNavRef = useRef();

  useEffect(() => {
    const clickHandler = e => {
      if (shown && !sideNavRef.current.contains(e.target)) {
        toggleSideNav();
      }
    };

    const resizeHandler = () => {
      if (window.innerWidth <= 900) {
        document.addEventListener('mousedown', clickHandler);
      } else {
        document.removeEventListener('mousedown', clickHandler);
      }
    };

    if (shown) { resizeHandler(); }
    if (!shown && showTags) {
      setShowTags(false);
    }

    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
      document.removeEventListener('mousedown', clickHandler);
    };
  }, [shown]);

  const toggleTagsHandler = () => {
    if (!shown) {
      toggleSideNav();
    }
    setShowTags(prev => !prev);
  };

  const resetListShown = () => {
    if (window.innerWidth <= 750) {
      setListShown(true);
    }
  };

  const toggleTrashHandler = bool => {
    setShowTrash(bool);
    resetListShown();
  };

  return (
    <>
      <div
        ref={sideNavRef}
        className={`SideNav ${shown ? 'SideNav--expand' : 'SideNav--contract'}`}
      >
        <ToggleSideNavBtn isExpanded={shown} onClick={toggleSideNav} />
        <div className="SideNav__title">
          {logo}
          <div>Notely</div>
        </div>
        <SearchBar isExpanded={shown} toggleSideNav={toggleSideNav} />
        <div className="SideNav__container">
          <SideNavLink
            onClick={() => toggleTrashHandler(false)}
            title="All Notes"
            icon={notesIcon}
            shown={shown}
          />
          <SideNavLink
            onClick={() => toggleTrashHandler(true)}
            title="Trash"
            icon={trashIcon}
            shown={shown}
          />
          <SideNavLink
            onClick={() => setShowSettings(true)}
            title="Settings"
            icon={settingsIcon}
            shown={shown}
          />
          <SideNavLink
            onClick={() => setShowAccnt(true)}
            title="Account"
            icon={personIcon}
            shown={shown}
          />
          <SideNavLink
            onClick={() => setShowInvitesModal(true)}
            title="Invites"
            icon={peopleIcon}
            shown={shown}
          >
            <div>Invites</div>
            {hasInvites && <span className="SideNav__notif" />}
          </SideNavLink>
          <SideNavLink
            onClick={toggleTagsHandler}
            title="Tags"
            icon={tagsIcon}
            shown={shown}
          >
            <div>Tags</div>
            <span className={`
              SideNav__toggleTagBtn
              ${showTags ? 'SideNav__toggleTagBtn--rotate' : ''}
            `}>
              {backIcon}
            </span>
          </SideNavLink>
          <SideNavTags
            showTags={showTags}
            shown={shown}
            toggleSideNav={toggleSideNav}
            resetListShown={resetListShown}
          />
        </div>
        <Link to="/help" className="SideNav__link SideNav__helpLink">
          <div className="SideNav__innerLink">
            {helpIcon}
            <div>Help</div>
          </div>
          {!shown && <Tooltip position="right">Help</Tooltip>}
        </Link>
      </div>
      {showAccnt && <AccountModal close={() => setShowAccnt(false)} />}
      {showSettings && <SettingsModal close={() => setShowSettings(false)} />}
      {showInvitesModal && <InvitesModal close={() => setShowInvitesModal(false)} />}
    </>
  );
};

const SideNavLink = ({ onClick, title, icon, children, shown }) => {
  const clickHandler = e => {
    e.currentTarget.blur();
    onClick();
  };

  const keyPressHandler = e => {
    if (e.key === 'Enter') {
      clickHandler(e);
    }
  };

  return (
    <div
      className="SideNav__link"
      onClick={clickHandler}
      tabIndex="0"
      onKeyPress={keyPressHandler}
    >
      <div className="SideNav__innerLink">
        {icon}
        {children || <div>{title}</div>}
      </div>
      {!shown && <Tooltip position="right">{title}</Tooltip>}
    </div>
  );
};

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
