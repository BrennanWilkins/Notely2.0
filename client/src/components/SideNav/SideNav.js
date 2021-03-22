import React, { useState } from 'react';
import './SideNav.css';
import PropTypes from 'prop-types';
import ToggleSideNavBtn from '../UI/ToggleSideNavBtn/ToggleSideNavBtn';
import { logo, notesIcon, trashIcon, settingsIcon, tagsIcon } from '../UI/icons';
import { connect } from 'react-redux';
import { toggleSideNav } from '../../store/actions';
import SettingsModal from '../SettingsModal/SettingsModal';

const SideNav = props => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className={`SideNav ${props.sideNavShown ? 'SideNav--expand' : 'SideNav--contract'}`}>
        <ToggleSideNavBtn isExpanded={props.sideNavShown} onClick={props.toggleSideNav} />
        <div className="SideNav__title">
          {logo}<div>Notely</div>
        </div>
        <div className="SideNav__link">
          {notesIcon}<div>All Notes</div>
        </div>
        <div className="SideNav__link">
          {trashIcon}<div>Trash</div>
        </div>
        <div className="SideNav__link" onClick={() => setShowSettings(true)}>
          {settingsIcon}<div>Settings</div>
        </div>
        <div className="SideNav__link">
          {tagsIcon}<div>Tags</div>
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
