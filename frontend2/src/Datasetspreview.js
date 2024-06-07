import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DatasetsPreview = () => {

const Divider = () => {
    return (
        <hr
            style={{ borderTop: "1px solid blue",
            maxWidth: "800px",             }}
        ></hr>
    );
    };
      
const navigate = useNavigate();
const routeChange = () =>{ 
    navigate('../login');
  }

    return (
        <center>
            <div>
                <h2>Datasets</h2>

                <h4>Create, manage, and share your datasets with the world!</h4>
                
                <h3>Create Dataset</h3>
                
                <h7>Name: Your Dataset Name Here!</h7>
                
                <h7>Label: Your Dataset Name Here!</h7>

                    <button class="button" onClick={routeChange} type="submit">Login</button>
            </div>
        </center>
    );
};

export default DatasetsPreview;
