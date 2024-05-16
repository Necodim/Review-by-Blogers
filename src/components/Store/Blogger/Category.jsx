import React, { useEffect } from 'react'
import '../Store.css'
import { useUserProfile } from '../../../hooks/UserProfileContext';
import Preloader from '../../Preloader/Preloader';

const Category = (props) => {

    const screen = (
        <div className='content-wrapper'>
            <h1 className='h1'>
                Категория
            </h1>
        </div>
    );

    return screen;
}

export default Category