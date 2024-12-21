import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { AuthContext } from '../../context/auth-context';
import Avatar from '../Avatar/Avatar';
import './Navbar.css'

const Navbar = ({setShowLogin}) => {

  const [menu, setMenu] = useState("menu");
  const auth = useContext(AuthContext);

  const logoutHandler = () => {
    auth.logout();
  }

  const showLogin = () => {
    setShowLogin(true);
  }

  const {getTotalCartAmount} = useContext(StoreContext);

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={()=>setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact-us</a>
      </ul>
      <div className="navbar-right">
        <Link to={`/settings/${auth.userId}`} className='navbar-profile__image'>
          {auth.isLoggedIn && <Avatar image='/tomato.jpg' alt='tomato'/>}
        </Link>
        {auth.isLoggedIn && <div className="navbar-search-icon">
          <Link to='/cart'>
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount()===0 ? "" : "dot"}></div>
        </div>}
        {!auth.isLoggedIn ? 
          (<button onClick={showLogin}>sign in</button>) : 
          (<button onClick={logoutHandler}>logout</button>)
        }
      </div>
    </div>
  )
}

export default Navbar
