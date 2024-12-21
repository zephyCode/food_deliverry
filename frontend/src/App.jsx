import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import {AuthContext} from './context/auth-context';
import UserSettings from './pages/UserSttings/UserSettings';

const App = () => {

  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if(showLogin) {
      document.body.style.overflow = "hidden";
    }
    else {
      document.body.style.overflow = "auto";
    }
    return (() => {
      document.body.style.overflow = "auto";
    });
  }, [showLogin]);

  const login = useCallback((userId) => {
    setUserId(userId);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setIsLoggedIn(false);
  }, []);

  let routes;
  if(isLoggedIn) {
    routes = (
      <Routes>
        <Route path='/' element={<Home/>}/>  
        <Route path='/cart' element={<Cart/>}/>  
        <Route path='/order' element={<PlaceOrder/>}/>
        <Route path={`/settings/${userId}`} element={<UserSettings/>}/>
        <Route path='*' element={<Navigate to='/'/>}/>
      </Routes>
    );
  }
  else {
    routes = (
      <Routes>
        <Route path='/' element={<Home/>}/>  
        <Route path='*' element={<Navigate to='/'/>}/>
      </Routes>
    );
  }
  
  return (
    <AuthContext.Provider 
      value={
        {
          login: login, 
          logout: logout, 
          userId: userId,
          isLoggedIn: isLoggedIn
        }
      }
    >
      {showLogin && <LoginPopup setShowLogin={setShowLogin}/>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/> 
        {routes}  
      </div>
      <Footer/>
    </AuthContext.Provider>
  )
}

export default App
