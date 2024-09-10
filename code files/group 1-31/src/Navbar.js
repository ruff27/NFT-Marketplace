import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';

function NavBar({ isLoggedIn, onLogout }) {

  return (
    <div className="nav-bar">
      <div className="nav-left">
        <Link to="/home">
          <CurrencyExchangeRoundedIcon style={{ fontSize: 30 }} />DOGE
        </Link>
        <Link to="/home">HOME</Link>
        <Link to="/marketplace">MARKETPLACE</Link>
        <Link to="/history">HISTORY</Link>
      </div>
      <div className="nav-right">
        {isLoggedIn ? (
          <button onClick={onLogout}>Sign Out</button>
        ) : null}
      </div>
    </div>
  );
}

export default NavBar;
