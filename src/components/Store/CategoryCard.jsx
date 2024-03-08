import React from 'react'
import './Store.css'

const CategoryCard = (props) => {

    const card = (
        <div {...props} className={'category-card' + (props.className ? ' ' + props.className : '')}>
            <span className='category-card-title'>{props.title}</span>
            {props.count && <span className='category-card-count'>{props.count}</span>}
        </div>
    );

    return card;
}

export default CategoryCard