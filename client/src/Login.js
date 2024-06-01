import React, { useState } from 'react';
import Signup from './SignUp';
import Spacer from './Spacer';

export default function Login() {
    const [showLoginForm, setShowLoginForm] = useState(true);

    const handleRegister = () => {
        setShowLoginForm(false);
    };

    return (
    <div className="login-wrapper">
        
        {showLoginForm && (
            <>
                <Spacer size={20} />

                <h6><center>Welcome Back!</center></h6>
                <Spacer size={1} />

                <center><form>
                <label>
                <h2>Username</h2>
                <input type="text" placeholder="Username" required />
                
                <h2>Password</h2>
                <input type="password" placeholder="Password" required />
                </label>
                <Spacer size={50} />

                <div>
                    <button class="button" type="submit">Submit</button>

                    <Spacer size={90} />

                    <div className ="register-link"> <h1>Don't have an account?</h1> 
                          <Spacer size={20} />
                    <button class="button" onClick={handleRegister}>Register</button>
                    </div>
                </div>
                </form></center>
            </>
        )}
        {!showLoginForm && <Signup />}
        
    </div>

    );
}
