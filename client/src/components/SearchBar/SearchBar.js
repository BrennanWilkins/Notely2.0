import React, { useState, useRef } from 'react';
import './SearchBar.css';
import PropTypes from 'prop-types';
import { searchIcon, xIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';

const SearchBar = props => {
  const [searchVal, setSearchVal] = useState('');
  const inputRef = useRef();

  const clickHandler = () => {
    if (!props.sideNavShown) {
      props.toggleSideNav();
      setTimeout(() => inputRef.current.focus(), 250);
    }
  };

  const clearSearch = () => {
    setSearchVal('');
  };

  return (
    <div
      className={`SearchBar ${props.sideNavShown ? '' : 'SearchBar--contract'}`}
      onClick={clickHandler}
    >
      <div className="SearchBar__icon">{searchIcon}</div>
      <input
        ref={inputRef}
        value={searchVal}
        onChange={e => setSearchVal(e.target.value)}
        className="SearchBar__input"
        placeholder="Search notes or tags"
      />
      <div
        className={`SearchBar__clear ${searchVal ? 'SearchBar__clear--active' : ''}`}
        onClick={clearSearch}
      >
        {xIcon}
      </div>
      {!props.sideNavShown && <Tooltip position="right">Search</Tooltip>}
    </div>
  );
};

SearchBar.propTypes = {
  sideNavShown: PropTypes.bool.isRequired,
  toggleSideNav: PropTypes.func.isRequired
};

export default SearchBar;
