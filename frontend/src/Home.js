import React, { useState } from 'react';
import axios from './axiosConfig';
import { useNavigate } from 'react-router-dom';
import "./Home.css"
import myImage from './Skyscraper.png'; 
import myImage2 from './image10.jpg'; 
import myImage3 from './image10Annotated.jpg'; 
import Spacer from './Spacer';
    import Animation from "./Animation";
import myImage4 from './natural.jpeg'; 

const Home = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const routeChange = () =>{ 
        navigate('../detection');
    }

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        setError(null);

        if (!username || !password) {
            setError({ detail: "All fields are required." });
            return;
        }
        axios.post('/api/login/', {
            username: username,
            password: password,
        })
        .then(response => {
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            navigate('/profile');
        })
        .catch(error => {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError({ detail: "An unknown error occurred." });
            }
        });
    };

    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!username || !password || !confirmPassword || !email) {
            setError({ detail: "All fields are required." });
            return;
        }

        if (password !== confirmPassword) {
            setError({ detail: "Passwords do not match." });
            return;
        }

        axios.post('/api/register/', {
            username: username,
            password: password,
            email: email,
        })
        .then(response => {
            console.log(response.data);
            setSuccess('Registration successful!');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setEmail('');
        })
        .catch(error => {
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError({ detail: "An unknown error occurred." });
            }
        });
    };

    return (

        <div style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <center>
            <div className="grid" id="login-register">
                <table id="menu">
                    <tbody>
                        <tr>
                            <td 
                                id="login-btn" 
                                className={`tab ${isLogin ? 'selected' : ''}`} 
                                onClick={() => {setIsLogin(true); setError(null); setSuccess(null); }}
                            >
                                Login
                            </td>
                            <td 
                                id="register-btn" 
                                className={`tab ${!isLogin ? 'selected' : ''}`} 
                                onClick={() => {setIsLogin(false); setError(null); setSuccess(null); }}
                            >
                                Register
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div id="login" className={`page ${isLogin ? 'selected' : ''}`}>
                    <form onSubmit={handleLoginSubmit}>
                        <label>
                            <input 
                                type="text" 
                                value={username} 
								placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </label>
                        <label>
                            <input 
                                type="password" 
                                value={password} 
								placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </label>
                        <br/><br/>
                        <button className="login-register-button" type="submit">Login</button>
                    </form>
                    {error && (
                        <div style={{ color: 'red' }}>
                            {error.detail || Object.values(error).map((err, index) => (
                                <div key={index}>{err}</div>
                            ))}
							<br/>
                        </div>
                    )}
					<br/>
                </div>
                <div id="register" className={`page ${!isLogin ? 'selected' : ''}`}>
                    <form onSubmit={handleRegisterSubmit}>
                        <label>
                            <input 
                                type="text" 
                                value={username} 
								placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </label>
                        <label>
                            <input 
                                type="password" 
                                value={password} 
								placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </label>
                        <label>
                            <input 
                                type="password"
                                value={confirmPassword} 
								placeholder="Confirm Password"
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                            />
                        </label>
                        <label>
                            <input 
                                type="email" 
                                value={email} 
								placeholder="email@example.com"
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </label>
                        <br/><br/>
                        <button className="login-register-button" type="submit">Register</button>
                    </form>
                    {error && (
                        <div style={{ color: 'red' }}>
                            {error.detail || Object.values(error).map((err, index) => (
                                <div key={index}>{err}</div>
                            ))}
							<br/>
                        </div>
                    )}
                    {success && (
                        <div style={{ color: '#22de33' }}>
                            {success}
							<br/>
                        </div>
                    )}
					<br/>
                </div>
            </div>
            <div className="content"> 
      <div>
        <h2><center>Explore the World with AI</center></h2>
        <div>
        <Spacer size={40} />

      <center><img src={myImage} class="image" /> </center>
        </div>
      </div>

      <Spacer size={30} />

      <div className="animation-container" style={{ textAlign: 'left' }}>
    <center>{Animation()}</center>
        </div>

      <Spacer size={90} />

      <Divider />

      <Spacer size={20} />

      <h3><center>See your Model in Action! </center></h3>

     <Spacer size={3} />

        <div className="image-container">
    <div className="image-section">
        <h2 className="image-header">Left: Original Image</h2>
        <img src={myImage2} className="image2" />
    </div>
    <div className="image-section">
        <h2 className="image-header">Right: Detected Objects</h2>
        <img src={myImage3} className="image2" />
    </div>
    </div>
        <Spacer size={20} />


      <Spacer size={90} />

      <Divider />

      <Spacer size={30} />

      <h2><center>Try it Yourself:</center></h2>

      <h1><center>Image Upload</center></h1>
      
      <center>
      <button class="button" onClick={routeChange}>Upload File</button>

      <Spacer size={90} />

     <Divider />

      <Spacer size={70} />

      <h1><center>Advanced Image Detection for the Future of Computing</center></h1>
      <Spacer size={20} />

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '40%' }}>
          <h3>Object Detection Models: The Power Behind the Magic</h3>
          <Spacer size={20} />
          <p>
            <h7>Object detection is at the forefront of AI innovation. State-of-the-art models like YOLO and SSD are revolutionizing industries from self-driving cars to medical imaging. 
              These models are incredibly fast and accurate, able to locate and classify multiple objects within an image in real-time. We harness the power of these advanced models to provide you with unparalleled object detection capabilities.</h7>
          </p>
        </div>

        <div style={{ width: '40%' }}>
          <h3>Open Source: Democratizing AI for Everyone</h3>
          <p>
          <Spacer size={20} />

            <h7>We believe in the power of open source software to drive collaboration and innovation. 
              Our platform is built on open source technologies, and we encourage you to explore the code and contribute to the community. 
              By leveraging the open source ecosystem, we can collectively push the boundaries of what's possible 
              in computer vision and make Artificial Intelligence technologies accessible to everyone.
            </h7>
          </p>
      
        </div>
      </div>
      <Spacer size={50} />

      <Divider />

      <Spacer size={50} />

      <h1>Real-World Applications: Making a Difference</h1>
      <Spacer size={30} />

      <p>
        <h3>Object detection is more than just cool technology — it's changing the way we live and work. 
          Here are a few examples of how our platform can be used in the real world!</h3>
      </p>
      <Spacer size={20} />
      <h7>Autonomous Vehicles:   Detecting pedestrians and traffic signs to ensure safe driving.<br></br><br></br>
      Medical Imaging:   Identifying tumors and other anomalies in X-rays and scans.<br></br><br></br>
      Security Systems:   Monitoring surveillance footage for suspicious activity.<br></br><br></br>
      Retail Analytics:   Analyzing customer behavior in stores.<br></br><br></br>
      Agriculture:   Monitoring crop health and detecting pests.</h7>
    
      <Spacer size={50} />

      <Divider />
      <Spacer size={50} />

      <p><h1>The possibilities are endless, and we're excited to see what you create!</h1></p>
      <Spacer size={50} />

      <center><img src={myImage4} class="image" /> </center>

      <Spacer size={50} />

      </center>

      </div>
      </center>
    </div>
  </div>
 
        
    );
};

const Divider = () => {
    return (
        <hr
            style={{ borderTop: "2px solid blue" }}
        ></hr>
    );
  };

export default Home;
