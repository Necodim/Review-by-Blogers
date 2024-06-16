import React from 'react'
import './Preloader.css'
import Background from '../Background/Background';

const Preloader = (props) => {
	return (
		<div className='preloader-wrapper'>
			<h1>{props.children}</h1>
			<div className='preloader-box'>
				<div className='loader'></div>
			</div>
			<Background />
		</div>
	);
}

export default Preloader;