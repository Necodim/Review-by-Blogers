import React from 'react'
import './Header.css'
import { Link, useLocation } from 'react-router-dom';
import { useUserProfile } from '../../UserProfileContext';
import Button from '../../components/Button/Button'
import Icon from '../Icon/Icon'

const Header = (props) => {
    const { profile, loading } = useUserProfile();
    if (loading) {
        return (
            <div className={'header'}>
                <div className="nav-buttons-wrapper">
                    <Button className={`nav-button light ${isActive('/store') ? 'active' : ''}`}>
                        <Icon icon='list' />
                        <span>{profile.role === 'bloger' ? 'Категории' : 'Товары'}</span>
                    </Button>
                    <Button className={`nav-button light ${isActive('/barter') ? 'active' : ''}`}>
                        <Icon icon='groups' />
                        <span>Бартеры</span>
                    </Button>
                    <Button className={`nav-button light ${isActive(profile.role) ? 'active' : ''}`}>
                        <Icon icon='person' />
                        <span>Профиль</span>
                    </Button>
                </div>
            </div>
        )
    }

    const location = useLocation();

    const isActive = (path) => {
        const paths = location.pathname.split('/');
        const result = paths[paths.length - 1] === path ? 'active' : '';
        return result;
    };

    return (
        <div className={'header'}>
            <div className="nav-buttons-wrapper">
                <Link to={ `../${profile.role}/store` }>
                    <Button className={`nav-button light ${isActive('store')}`}>
                        <Icon icon='list' />
                        <span>{profile.role === 'bloger' ? 'Категории' : 'Товары'}</span>
                    </Button>
                </Link>
                <Link to={ `../${profile.role}/barter` }>
                    <Button className={`nav-button light ${isActive('barter')}`}>
                        <Icon icon='groups' />
                        <span>Бартеры</span>
                    </Button>
                </Link>
                <Link to={ `../${profile.role}` }>
                    <Button className={`nav-button light ${isActive(profile.role)}`}>
                        <Icon icon='person' />
                        <span>Профиль</span>
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default Header