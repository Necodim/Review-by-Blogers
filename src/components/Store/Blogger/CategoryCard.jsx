import React from 'react'
import '../Store.css'

const CategoryCard = (props) => {
	return (
		<div {...props} className={'category-card' + (props.className ? ' ' + props.className : '')}>
			<span className='category-card-title'>{props.title}</span>
			{props.count && <span className='category-card-count'>{props.count}</span>}
		</div>
	);
}

export default CategoryCard