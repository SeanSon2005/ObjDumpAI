import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import Datasets from './Datasets';
import DatasetDetail from './DatasetDetail';


import Home from './Home';
import Navbar from './Navbar';
import Database from './Database';


const App = () => {
   return (
       <Router>
           <div>
               <nav>
                   <ul>
                       <li><Link to="/logout">Logout</Link></li>
                   </ul>
               </nav>
               <Navbar />


               <Routes>
                   <Route path="/" element={<Home />} /> 
                   <Route path="/database" element={<Database />} /> 
                   <Route path="/login/register" element={<Register/>} />
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
