import React from 'react'
import './Store.css'
import { useUserProfile } from '../../hooks/UserProfileContext';
import StoreSeller from './Seller/StoreSeller.jsx';
import StoreBlogger from './Blogger/StoreBlogger.jsx';

const Store = (props) => {
    const { profile } = useUserProfile();

    if (profile.role === 'seller') {
        return (<StoreSeller />)
    } else if (profile.role === 'blogger') {
        return (<StoreBlogger />)
    }
}

export default Store;