import React, { useState } from 'react';
import Button from '../Button/Button';
import InputField from '../Form/InputField';

const SearchBar = ({ onSearch, placeholder }) => {
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
    <div id='search-bar' className='list-item gap-s'>
      <InputField
        type='text'
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        icon='backspace'
        iconCallback={handleClearAndCancel}
      />
      <Button icon='search' onClick={handleSearch} />
    </div>
  );
};

export default SearchBar;