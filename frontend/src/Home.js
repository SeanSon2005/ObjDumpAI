import React, { useState } from 'react';
import axios from './axiosConfig';
import { useNavigate } from 'react-router-dom';
import "./Home.css"

const Home = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

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
        </center>
    );
};

export default Home;
