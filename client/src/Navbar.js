const Navbar = () => {
    return (
      <nav className="navbar">
        <h1>AI Object Detection</h1>
        <div className="links">
          <a href="/">Home</a>
          <a href="/">Upload Database</a>
          <a href="/login" style={{ 
            color: 'white', 
            backgroundColor: '#007FFF',
            borderRadius: '10px' 
          }}>Login</a>
        </div>
      </nav>
    );
  }
   
  export default Navbar;
