const Navbar = () => {
    return (
      <nav className="navbar">
        <h1>AI Object Detection</h1>
        <div className="links">
          <a href="/">Home</a>

          <a href="/database" style={{ 
          }}>Image Database</a>
          
            <a href="/datasets" style={{ 
          }}>Datasets</a>

           <a href="/profile" style={{ 
          }}>Profile</a>
          
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

