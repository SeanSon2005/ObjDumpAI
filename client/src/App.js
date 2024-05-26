import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home'; 
import Database from './Database';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />  
          <Route path="/database" element={<Database />} />  
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
