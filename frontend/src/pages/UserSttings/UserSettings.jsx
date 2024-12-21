import React, { useState } from 'react';

import Avatar from '../../components/Avatar/Avatar';
import Profile from '../../components/Profile/Profile';
import Orders from '../../components/Orders/Orders';
import Settings from '../../components/Settings/Settings';

import './UserSettings.css';

export default function UserSettings() {
    const [selected, setSelected] = useState('profile');

    const handleSelection = (item) => {
        setSelected(item);
    }

  return (
    <React.Fragment>
        <div className="settings-wrapper">
            <div className=".user-settings__container-left">
                <ul className="user-settings__list">
                    <li className='user-settings__list-item'>
                        <div className="user-settings__image">
                            <Avatar image="/tomato.jpg" alt="tomato" />
                            <button className="user-settings__button">Change Img</button>
                        </div>
                    </li>
                    <li className={`user-settings__list-item ${selected === 'profile' ? 'selected' : ''}`} onClick={() => handleSelection('profile')}>profile</li>
                    <li className={`user-settings__list-item ${selected === 'orders'  ? 'selected' : ''}`} onClick={() => handleSelection('orders')}>orders</li>
                    <li className={`user-settings__list-item ${selected === 'settings'  ? 'selected' : ''}`} onClick={() => handleSelection('settings')}>settings</li>
                </ul>
            </div>
            <div className="vertical-line"></div>
            <div className="user-settings__container-right">
                {selected === 'profile' && <Profile/>}
                {selected === 'orders' && <Orders/>}
                {selected === 'settings' && <Settings/>}
            </div>
        </div>
    </React.Fragment>
  );
}
