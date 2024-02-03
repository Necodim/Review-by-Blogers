import React from 'react'
import './Preloader.css'

const Preloader = (props) => {
    
    return (
        <div className='preloader-wrapper'>
            <h1>{ props.children }</h1>
            <div className='preloader'></div>
        </div>
    );
}


export default Preloader