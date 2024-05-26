import Login from './Login';
import React, { useState } from 'react';

const Navbar = () => {
  const [setToken] = useState();
  const [clicked, setClicked] = useState(false)

  const handleClick = function(){
    setClicked(true)
  }
    return (
      <nav className="navbar">
        <h1>AI Object Detection</h1>
        <div className="links">
          <a href="/">Home</a>
          <a href="/">Upload Database</a>
          <button 
            onClick={handleClick}
            style={{ 
              color: 'white',
              backgroundColor: '#007FFF',
              borderRadius: '10px',
              padding: '0.5em 1em',
              textDecoration: 'none',
              cursor: 'pointer',
              fontFamily: 'Roboto, sans-serif',
              marginLeft: '30px' 
          }}>Login</button>
        </div>
        {clicked && <Login setToken={setToken} />}
      </nav>
    );
  }
   
  export default Navbar;
