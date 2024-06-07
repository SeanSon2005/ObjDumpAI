import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import Login from './Login'
import Logout from './Logout';
import Profile from './Profile';
import Datasets from './Datasets';
import DatasetDetail from './DatasetDetail';
import DatasetUpload from './DatasetUpload';
import DatasetSearch from './DatasetSearch';
import DatasetReadonly from './DatasetReadonly';
import PublicProfile from './PublicProfile';
import Home from './Home';
import './index.css';
import Navbar from './Navbar';
import Register from './Register';
import DatasetsPreview from './Datasetspreview';
import ModelsPreview from './ModelsPreview';
import Models from './Models';
import Detection from './Detection';

const App = () => {
    return (
        <Router>
            <div>

                <Navbar />

                <Routes>
					<Route path="/" element={<Home />} />
                    <Route path="/detection" element={<Detection />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/datasetspreview" element={<DatasetsPreview />} />
                    <Route path="/modelspreview" element={<ModelsPreview />} />
                    <Route path="/logout" element={<Logout/>} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path="/datasets" element={<Datasets/>} />
                    <Route path="/models" element={<Models/>} />
					<Route path="/datasets/:datasetId" element={<DatasetDetail/>} />
					<Route path="/readonly/:datasetId" element={<DatasetReadonly/>} />
					<Route path="/browse" element={<DatasetSearch/>} />
					<Route path="/upload/:datasetId" element={<DatasetUpload/>} />
					<Route path="/user/:userId" element={<PublicProfile/>} />
					<Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
