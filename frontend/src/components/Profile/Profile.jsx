import React, { useContext, useEffect, useState } from 'react';
import Input from '../FormElements/Input';
import { useForm } from '../../hooks/form-hook';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../util/validators';
import { AuthContext } from '../../context/auth-context';
import './Profile.css';

export default function Profile() {
    const auth = useContext(AuthContext);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [formState, inputHandler, setFormData] = useForm({
        name: { value: '', isValid: false },
        email: { value: '', isValid: false },
        password: { value: '', isValid: false }
    }, false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${auth.userId}`);
                if (response.ok) {
                    const responseData = await response.json();
                    setFormData({
                        name: { value: responseData.user.name, isValid: true },
                        email: { value: responseData.user.email, isValid: true },
                        password: { value: responseData.user.password, isValid: true }
                    }, true);
                    setIsDataFetched(true);
                } else {
                    throw new Error('Failed to fetch user profile');
                }
            } catch (err) {
                setIsDataFetched(false);
            }
        };
        fetchUserProfile();
    }, [auth.userId, setFormData]);    

    const [isEditable, setIsEditable] = useState({
        name: false,
        email: false,
        password: false
    });

    const handleEdit = (field) => {
        setIsEditable((prev) => ({ ...prev, [field]: true }));
    };

    const updateUserProfileHandler = async (event) => {
        event.preventDefault();
        if (formState.isValid) {
            try {
                const response = await fetch(`http://localhost:5000/api/user/update/profile/${auth.userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                });
                if (!response.ok) {
                    setIsDataFetched(false);
                    return;
                }
                setIsDataFetched(true);
    
            } catch (err) {
                setIsDataFetched(false);
            }
        }
    }
    

    if (!isDataFetched) {
        return <p>Loading...</p>;
    }

    return (
        <React.Fragment>
            <form className='profile-form' onSubmit={updateUserProfileHandler}>
                <ul className='profile-container__list'>
                    <li className="profile-user-list__item">
                        <Input
                            id="name"
                            type="text"
                            label="Name"
                            element='input'
                            disabled={!isEditable.name}
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE()]}
                            initialValue={formState.inputs.name.value}
                            initialValid={formState.inputs.name.isValid}
                        />
                        <button
                            onClick={() => handleEdit('name')}
                            disabled={isEditable.name}
                        >
                            edit
                        </button>
                    </li>
                    <li className="profile-user-list__item">
                        <Input
                            id="email"
                            type="email"
                            label="Email"
                            element='input'
                            disabled={!isEditable.email}
                            onInput={inputHandler}
                            validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()]}
                            initialValue={formState.inputs.email.value}
                            initialValid={formState.inputs.email.isValid}
                        />
                        <button
                            onClick={() => handleEdit('email')}
                            disabled={isEditable.email}
                        >
                            edit
                        </button>
                    </li>
                    <li className="profile-user-list__item">
                        <Input
                            id="password"
                            type="password"
                            label="Password"
                            element='input'
                            disabled={!isEditable.password}
                            onInput={inputHandler}
                            validators={[VALIDATOR_MINLENGTH(8), VALIDATOR_REQUIRE()]}
                            initialValue={formState.inputs.password.value}
                            initialValid={formState.inputs.password.isValid}
                        />
                        <button
                            onClick={() => handleEdit('password')}
                            disabled={isEditable.password}
                        >
                            edit
                        </button>
                    </li>
                </ul>
                <button className='user-profile__submit-button' type='submit' disabled={!formState.isValid}>Update</button>
            </form>
        </React.Fragment>
    );
}

