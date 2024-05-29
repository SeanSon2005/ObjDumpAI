import './Login.css';
import React, { useState } from 'react';
import Login from './Login';
import Spacer from './Spacer';

export default function Signup() {
    const [showRegisterForm, setShowRegisterForm] = useState(true);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [same, setSame] = useState(false);  // Add state for checking password match

    const handleDone = (event) => {
        event.preventDefault();

        // Check if any of the fields are empty
        const allFieldsFilled = fullName && username && password && confirmPassword;

        if (!allFieldsFilled) {
            alert('Please fill in all the fields.');
            return;
        }

        // Check if passwords match
        const passwordsMatch = password === confirmPassword;

        if (!passwordsMatch) {
            alert('Passwords do not match.');
            setSame(false);  // Set same to false if passwords do not match
            return;
        }

        // If all fields are filled and passwords match, toggle visibility of forms
        setShowRegisterForm(false);
        setSame(true);  // Set same to true if passwords match
    };

    return (
        <div className="signup-wrapper">
            {showRegisterForm && (
                <>
                    <h1><center>Sign Up/Register</center></h1>
                    <Spacer size={20} />
                    <center>
                    <form onSubmit={handleDone}>
                        <label>
                            <p><center>First and Last Name</center></p>
                           <input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <p><center>Username</center></p>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <p><center>Password</center></p>
                            <input
                                type="text"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <p><center>Confirm Password</center></p>
                            <input
                                type="text"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </label>
                        <div>                 
                               <Spacer size={40} />
                            <button class="button" type="submit">Submit</button>
                        </div>
                    </form>
                    </center>
                </>
            )}
            {!showRegisterForm && same && <Login />}
        </div>
    );
}
