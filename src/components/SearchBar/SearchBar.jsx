import React, { useState } from 'react';
import Button from '../Button/Button';
import InputField from '../Form/InputField';

const SearchBar = ({ onSearch, placeholder, disabled }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleClearAndCancel = () => {
    setQuery('');
    onSearch('');
  }

  return (
    <div id='search-bar' className={'list-item justify-content-start gap-s' + (disabled ? ' disabled' : '')}>
      <InputField
        type='text'
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        icon='backspace'
        iconCallback={handleClearAndCancel}
        disabled={disabled}
      />
      <Button className='w-auto size-input' icon='search' onClick={handleSearch} disabled={disabled} />
    </div>
  );
};

export default SearchBar;