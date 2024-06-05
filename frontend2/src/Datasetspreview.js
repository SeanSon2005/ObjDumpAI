import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spacer from './Spacer';

const DatasetsPreview = () => {

const Divider = () => {
    return (
        <hr
            style={{ borderTop: "1px solid blue",
            maxWidth: "100px",             }}
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
                
                <h7>Label: Your Dataset Labels Here!</h7>

                    <button class="button" onClick={routeChange} type="submit">Create</button>
            </div>
        </center>
    );
};

export default DatasetsPreview;
