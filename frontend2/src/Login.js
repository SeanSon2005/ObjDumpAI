import React, { useState } from 'react';
import axios from './axiosConfig';
import { useNavigate } from 'react-router-dom';
import Spacer from './Spacer';

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

    const routeChange = () =>{ 
        let path = 'register'; 
        navigate(path);
      }

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
                <Spacer size={50} />
                <label>
                    <p>Password: </p>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </label>

                <Spacer size={30} />

				<br/><br/>
                <button class="button" type="submit">Login</button>
				<br/><br/>

                <Spacer size={90} />
                <Divider />
                <Spacer size={50} />

                <div className ="register-link"> <h1>Don't have an account?</h1> 
                     <Spacer size={20} />
                <button class="button" onClick={routeChange}>Register</button>
                </div>
                <Spacer size={90} />

                <Spacer size={30} />


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

const Divider = () => {
    return (
        <hr
            style={{ borderTop: "2px solid blue", 
                    maxWidth: "900px",
            }}
        ></hr>
    );
  };

export default Login;

