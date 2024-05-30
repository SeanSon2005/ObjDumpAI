import React, { useState } from 'react';
import axios from 'axios';

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
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <button type="submit">Register</button>
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
        </div>
    );
};

export default Register;
