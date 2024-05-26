import './Login.css';
import React, { useState } from 'react';
import Signup from './SignUp';

export default function Login() {
    const [showLoginForm, setShowLoginForm] = useState(true);

    const handleRegister = () => {
        setShowLoginForm(false);
    };

    return (
    <div className="login-wrapper">
        {showLoginForm && (
            <>
                <h1>Login</h1>
                <form>
                <label>
                <p>Username</p>
                <input type="text" placeholder="Username" required />
                </label>
                <label>
                <p>Password</p>
                <input type="password" placeholder="Password" required />
                </label>
                <div>
                    <button type="submit">Submit</button>
                    <div className="register-link">
                        Don't have an account? <button onClick={handleRegister}>Register</button>
                    </div>
                </div>
                </form>
            </>
        )}
        {!showLoginForm && <Signup />}
    </div>
    );
}