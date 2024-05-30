import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import Axios from "axios";

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/profile" element={<Profile/>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
