import React from 'react'
import './Header.css'
import { Link, useLocation } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram'
import { getProfile } from '../../hooks/getProfile'
import Button from '../../components/Button/Button'
import Icon from '../Icon/Icon'

const Header = (props) => {
    const { user } = useTelegram();
    const { userType } = getProfile();

    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === `/${userType}${path}`;
    };

    return (
        <div className={'header'}>
            <div className="nav-buttons-wrapper">
                <Link to={userType + '/store'}>
                    <Button className={`nav-button light ${isActive('/store') ? 'active' : ''}`}>
                        <Icon icon='list' />
                        <span>{userType === 'bloger' ? 'Категории' : 'Товары'}</span>
                    </Button>
                </Link>
                <Link to={userType + '/barter'}>
                    <Button className={`nav-button light ${isActive('/barter') ? 'active' : ''}`}>
                        <Icon icon='groups' />
                        <span>Бартеры</span>
                    </Button>
                </Link>
                <Link to={userType + '/profile'}>
                    <Button className={`nav-button light ${isActive('/profile') ? 'active' : ''}`}>
                        <Icon icon='person' />
                        <span>Профиль</span>
                    </Button>
                </Link>
            </div>
            <span className={'username'}>
                {user?.username}
            </span>
        </div>
    )
}

export default Header