import Spacer from './Spacer';

const Navbar = () => {
    return (
      <nav className="navbar">
        
        <a href="/" style={{ 
        color: '#3684d2',
         borderRadius: '10px', 
            fontFamily: 'Quicksand',
            fontSize: '32px',
            fontWeight: 'bold',
            
          }}>ObjdumpAI</a>
          
        <div className="links">
          
            <a href="/datasets" style={{ 
          }}>Datasets</a>

        <a href="/models" style={{ 
          }}>Models</a>

      <a href="/browse" style={{ 
          }}>Browse</a>

        <a href="/detection" style={{ 
          }}>Image Detection</a>

          <a href="/profile" style={{ 
            color: 'white', 
            backgroundColor: '#007FFF',
            borderRadius: '10px' 
          }}>My Profile</a>


        </div>
      </nav>
    );
  }
   
  export default Navbar;

