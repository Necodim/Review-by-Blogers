import React from 'react'
import './Background.css'
import Icon from '../Icon/Icon'

const Background = (props) => {
    return (
        <div className='bg'>
            <div className='bg-circle' />
            <div className="bg-star-wrapper" data-star="1"><Icon className='bg-star bg-star-1' icon='star' size='normal' /></div>
            <div className="bg-star-wrapper" data-star="2"><Icon className='bg-star bg-star-2' icon='star' size='big' /></div>
            <div className="bg-star-wrapper" data-star="3"><Icon className='bg-star bg-star-3' icon='star' size='small' /></div>
        </div>
    )
}

export default Background