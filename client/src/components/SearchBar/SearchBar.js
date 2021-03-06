import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';
import PropTypes from 'prop-types';
import { searchIcon, xIcon } from '../UI/icons';
import Tooltip from '../UI/Tooltip/Tooltip';
import { connect } from 'react-redux';
import { setSearchQuery } from '../../store/actions';

const SearchBar = ({
  isExpanded,
  toggleSideNav,
  setSearchQuery,
  searchQuery,
  shownTag
}) => {
  const [searchVal, setSearchVal] = useState('');
  const inputRef = useRef();
  const valRef = useRef('');

  const clickHandler = () => {
    if (!isExpanded) {
      toggleSideNav();
      setTimeout(() => inputRef.current.focus(), 250);
    }
  };

  const keyPressHandler = e => {
    if (e.key === 'Enter' && !isExpanded) {
      clickHandler();
      e.currentTarget.blur();
    }
  };

  const clearSearch = () => {
    setSearchVal('');
    setSearchQuery('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (valRef.current === searchVal) { return; }
      setSearchQuery(searchVal);
      valRef.current = searchVal;
    }, 400);

    return () => clearTimeout(timer);
  }, [searchVal]);

  useEffect(() => {
    setSearchVal(searchQuery);
  }, [searchQuery]);

  return (
    <div
      className={`SearchBar ${isExpanded ? '' : 'SearchBar--contract'}`}
      onClick={clickHandler}
      tabIndex={isExpanded ? '-1' : '0'}
      onKeyPress={keyPressHandler}
    >
      <div className="SearchBar__icon">{searchIcon}</div>
      <input
        ref={inputRef}
        value={searchVal}
        onChange={e => setSearchVal(e.target.value)}
        className="SearchBar__input"
        placeholder={shownTag ? `Search in ${shownTag}` : 'Search Notes'}
      />
      <div
        className={`SearchBar__clear ${searchVal ? 'SearchBar__clear--active' : ''}`}
        onClick={clearSearch}
      >
        {xIcon}
      </div>
      {!isExpanded && <Tooltip position="right">Search</Tooltip>}
    </div>
  );
};

SearchBar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  shownTag: PropTypes.string
};

const mapStateToProps = state => ({
  searchQuery: state.notes.searchQuery,
  shownTag: state.notes.shownTag
});

const mapDispatchToProps = dispatch => ({
  setSearchQuery: query => dispatch(setSearchQuery(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
