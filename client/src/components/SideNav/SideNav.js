import React, { useState } from 'react';
import './SideNav.css';
import PropTypes from 'prop-types';
import ToggleSideNavBtn from '../UI/ToggleSideNavBtn/ToggleSideNavBtn';
import { logo, notesIcon, trashIcon, settingsIcon, tagsIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { toggleSideNav } from '../../store/actions';
import SettingsModal from '../SettingsModal/SettingsModal';
import Tooltip from '../UI/Tooltip/Tooltip';

const SideNav = props => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className={`SideNav ${props.sideNavShown ? 'SideNav--expand' : 'SideNav--contract'}`}>
        <ToggleSideNavBtn isExpanded={props.sideNavShown} onClick={props.toggleSideNav} />
        <div className="SideNav__title">
          {logo}<div>Notely</div>
        </div>
        <div className="SideNav__container">
          <div className="SideNav__link">
            <div className="SideNav__innerLink">{notesIcon}<div>All Notes</div></div>
            {!props.sideNavShown && <Tooltip className="SideNav__tooltip" position="right">All Notes</Tooltip>}
          </div>
          <div className="SideNav__link">
            <div className="SideNav__innerLink">{trashIcon}<div>Trash</div></div>
            {!props.sideNavShown && <Tooltip className="SideNav__tooltip" position="right">Trash</Tooltip>}
          </div>
          <div className="SideNav__link" onClick={() => setShowSettings(true)}>
            <div className="SideNav__innerLink">{settingsIcon}<div>Settings</div></div>
            {!props.sideNavShown && <Tooltip className="SideNav__tooltip" position="right">Settings</Tooltip>}
          </div>
          <div className="SideNav__link">
            <div className="SideNav__innerLink">{tagsIcon}<div>Tags</div></div>
            {!props.sideNavShown && <Tooltip className="SideNav__tooltip" position="right">Tags</Tooltip>}
          </div>
        </div>
      </div>
      {showSettings && <SettingsModal close={() => setShowSettings(false)} />}
    </>
  );
};

SideNav.propTypes = {
  sideNavShown: PropTypes.bool.isRequired,
  toggleSideNav: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  sideNavShown: state.ui.sideNavShown
});

const mapDispatchToProps = dispatch => ({
  toggleSideNav: () => dispatch(toggleSideNav())
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
