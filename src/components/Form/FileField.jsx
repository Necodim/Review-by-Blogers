import React, { useEffect, useRef, useState } from 'react';
import './Form.css';
import Button from '../Button/Button';
import InputField from './InputField';

const FileField = ({ id, title, accept, placeholder, value, multiple, iconCallback, comment, onChange, error, ...inputProps }) => {
  const fileInputRef = useRef(null);
  const [textValue, setTextValue] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  useEffect(() => {
    setTextValue(uploadedFiles.join(', '));
  }, [uploadedFiles])

  const handleButtonClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let array = uploadedFiles;
      array.push(files[i].name);
      array = [...new Set(array)];
      setUploadedFiles(array);
      onChange(files[i]);
    }
  };

  const handleChangeTextValue = (event) => {
    setTextValue(event.target.value);
  }

  const inputName = inputProps.name || id || 'input-name';

  return (
    <div id={'input-block-' + id} className='input-block'>
      {error && <small className='error-wrapper'>{error}</small>}
      {id && title && <label htmlFor={id}>{title}</label>}
      <div className='list-item gap-s'>
        <div className='input-wrapper'>
          <input
            type='file'
            accept={accept}
            className='file'
            ref={fileInputRef}
            name={inputName}
            onChange={handleFileChange}
            multiple={multiple}
            {...inputProps}
          />
          <InputField
            name={'file-' + inputName}
            placeholder={placeholder}
            value={textValue}
            readOnly={true}
            onChange={handleChangeTextValue}
            fade={true}
            icon='cloud_upload'
            iconCallback={handleButtonClick}
          />
        </div>
        <Button className='w-auto size-input' onClick={handleButtonClick}>Загрузить</Button>
      </div>
      {comment && <small>{comment}</small>}
    </div>
  );
};

FileField.defaultProps = {
	accept: 'image/*',
  multiple: false,
	placeholder: 'image.png',
};

export default FileField;