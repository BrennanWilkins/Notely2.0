import React, { useState } from 'react';
import './SideNav.css';
import ToggleSideNavBtn from '../UI/ToggleSideNavBtn/ToggleSideNavBtn';
import { logo, notesIcon, trashIcon, settingsIcon, tagsIcon } from '../UI/icons';

const SideNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`SideNav ${isExpanded ? 'SideNav--expand' : 'SideNav--contract'}`}>
      <ToggleSideNavBtn isExpanded={isExpanded} onClick={() => setIsExpanded(prev => !prev)} />
      <div className="SideNav__title">
        {logo}<div>Notely</div>
      </div>
      <div className="SideNav__link">
        {notesIcon}<div>All Notes</div>
      </div>
      <div className="SideNav__link">
        {trashIcon}<div>Trash</div>
      </div>
      <div className="SideNav__link">
        {settingsIcon}<div>Settings</div>
      </div>
      <div className="SideNav__link">
        {tagsIcon}<div>Tags</div>
      </div>
    </div>
  );
};

export default SideNav;
