import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ModelsPreview = () => {

const navigate = useNavigate();
const routeChange = () =>{ 
    navigate('../login');
  }

    return (
        <center>
            <div>
                <h2>Models</h2>

                <h4>Create, manage, and share your models with the world!</h4>
                
                <h3>Create Model</h3>
                
                <h7>Name: Your Model Name Here!</h7>
                
                    <button class="button" onClick={routeChange} type="submit">Login</button>
            </div>
        </center>
    );
};

export default ModelsPreview;
