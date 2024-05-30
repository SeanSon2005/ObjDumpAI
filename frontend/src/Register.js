import React, { useState } from 'react';
import axios from './axiosConfig';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = (event) => {
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
        <center><div>
            <h2>Register</h2>
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
                    <p>Password:</p>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </label>
                <label>
                    <p>Confirm Password:</p>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </label>
                <label>
                    <p>Email:</p>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </label>
				<br/><br/>
                <button type="submit">Register</button>
				<br/><br/>
            </form>
            {error && (
                <div style={{ color: 'red' }}>
                    {error.detail || Object.values(error).map((err, index) => (
                        <div key={index}>{err}</div>
                    ))}
                </div>
            )}
            {success && (
                <div style={{ color: 'green' }}>
                    {success}
                </div>
            )}
        </div></center>
    );
};

export default Register;
