import React from 'react';
import Popup from './Popup.jsx';

const PopupTask = ({ isOpen, onClose, task }) => {
	return (
		<Popup id='popup-task' isOpen={isOpen} onClose={onClose}>
			<h2>Техническое задание</h2>
			<div>{task}</div>
		</Popup>
	);
};

export default PopupTask;