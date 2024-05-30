import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import Datasets from './Datasets';
import DatasetDetail from './DatasetDetail';

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/datasets">Datasets</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/logout" element={<Logout/>} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path="/datasets" element={<Datasets/>} />
					<Route path="/datasets/:datasetId" element={<DatasetDetail/>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
