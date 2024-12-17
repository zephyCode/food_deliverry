import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import Input from '../FormElements/Input';
import Button from '../FormElements/Button';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../util/validators';
import { useForm } from '../../hooks/form-hook';
import { AuthContext } from '../../context/auth-context';
import './LoginPopup.css';

const LoginPopup = ({ setShowLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: '', isValid: false },
      password: { value: '', isValid: false },
      name: { value: '', isValid: isLoginMode },
      policy: { value: false, isValid: false },
    },
    false
  );

  const switchModeHandler = () => {
    if (isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: { value: '', isValid: false },
        },
        false
      );
    } else {
      const updatedInputs = { ...formState.inputs };
      delete updatedInputs.name;
      setFormData(
        {
          ...updatedInputs,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const loginFormSubmitHandler = async (event) => {
    event.preventDefault();
    if (formState.isValid) {
      if (!isLoginMode) {
        try {
          const response = await fetch('http://localhost:5000/api/user/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formState.inputs.name.value,
              email: formState.inputs.email.value,
              password: formState.inputs.password.value,
            }),
          });
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message || 'Signup failed! Please try again.');
          }
          auth.login(responseData.userId);
          setShowLogin(false);
        } 
        catch (err) {}
      }
      else {
        try {
          const response = await fetch('http://localhost:5000/api/user/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value,
            }),
          });
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message || 'Login failed! Please try again.');
          }
          auth.login(responseData.userId);
          setShowLogin(false);
        } 
        catch (err) {}
      }
    }
  };
  

  const policyChangeHandler = () => {
    setFormData(
      {
        ...formState.inputs,
        policy: { value: !formState.inputs.policy.value, isValid: !formState.inputs.policy.value },
      },
      formState.inputs.email.isValid &&
        formState.inputs.password.isValid &&
        (!isLoginMode || formState.inputs.name?.isValid) &&
        !formState.inputs.policy.value
    );
  };

  return (
    <div className='login-popup'>
      <form className='login-popup-container' onSubmit={loginFormSubmitHandler}>
        <div className='login-popup-title'>
          <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt='Close' />
        </div>
        <div className='login-popup-inputs'>
          {!isLoginMode && (
            <Input
              id='name'
              type='text'
              element='input'
              placeholder='Name'
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
          )}
          <Input
            id='email'
            type='email'
            element='input'
            placeholder='Email'
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />
          <Input
            id='password'
            type='password'
            element='input'
            placeholder='Password'
            validators={[VALIDATOR_MINLENGTH(8)]}
            onInput={inputHandler}
          />
        </div>
        <div className='login-popup-condition'>
          <input
            id='policy'
            type='checkbox'
            checked={formState.inputs.policy.value}
            onChange={policyChangeHandler}
          />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        <Button 
          type='submit' 
          disabled={!formState.isValid}
        >
          {isLoginMode ? 'Login' : 'Create Account'}
        </Button>
        <p>
          {isLoginMode ? 'Create a new account?' : 'Already a Customer?'}{' '}
          <span onClick={switchModeHandler}>Click here!</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
