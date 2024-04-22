import React from 'react'
import './Header.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserProfile } from '../../hooks/UserProfileContext';
import Button from '../../components/Button/Button'
import Icon from '../Icon/Icon'

const Header = (props) => {
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    // const paths = location.pathname.split('/');
    // const result = paths[paths.length - 1] === path ? 'active' : '';
    const result = location.pathname.indexOf(path) !== -1 ? 'active' : '';
    return result;
  };

  return (
    <div className={'header'}>
      <div className="nav-buttons-wrapper">
        <Button className={`nav-button light ${isActive('/store') ? 'active' : ''}`} onClick={loading ? navigate('/store') : () => {}}>
          <Icon icon='grid_view' />
          <span>{profile.role === 'blogger' ? 'Категории' : 'Товары'}</span>
        </Button>
        <Button className={`nav-button light ${isActive('/barters') ? 'active' : ''}`} onClick={loading ? navigate('/barters') : () => {}}>
          <Icon icon='groups' />
          <span>Бартеры</span>
        </Button>
        <Button className={`nav-button light ${isActive('/profile') ? 'active' : ''}`} onClick={loading ? navigate('/profile') : () => {}}>
          <Icon icon='person' />
          <span>Профиль</span>
        </Button>
      </div>
    </div>
  )
}

export default Header