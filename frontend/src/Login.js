import React, { useState } from 'react';
import axios from './axiosConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
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

    return (
		<center><div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username:</p>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </label>
                <label>
                    <p>Password: </p>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </label>
				<br/><br/>
                <button type="submit">Login</button>
				<br/><br/>
            </form>
            {error && (
                <div style={{ color: 'red' }}>
                    {error.detail || Object.values(error).map((err, index) => (
                        <div key={index}>{err}</div>
                    ))}
                </div>
            )}
        </div></center>
    );
};

export default Login;
