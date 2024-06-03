import React from 'react';
import './Note.css'

const Note = (props) => {
	return (
		<div className={`note${props.className ? ' ' + props.className : ''}`}>{props.children}</div>
	);
};

export default Note;