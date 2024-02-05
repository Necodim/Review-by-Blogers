import React from 'react'
import './Background.css'
import Icon from '../Icon/Icon'

const Background = (props) => {
    return (
        <div className='bg'>
            <div className='bg-circle' />
            <Icon className='bg-star bg-star-1' icon='star' size='normal' />
            <Icon className='bg-star bg-star-2' icon='star' size='big' />
            <Icon className='bg-star bg-star-3' icon='star' size='small' />
        </div>
    )
}

export default Background