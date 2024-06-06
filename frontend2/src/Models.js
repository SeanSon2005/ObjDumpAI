import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import Spacer from './Spacer';

const Models = () => {
    const navigate = useNavigate();
    const [models, setmodels] = useState([]);
    const [error, setError] = useState(null);
    const [modelName, setmodelName] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
            navigate('/modelspreview');
        } else {
            axios.get('/api/models/')
                .then(response => {
                    setmodels(response.data);
                })
                .catch(error => {
                    setError("There was an error fetching the models.");
                    console.error(error);
                });
        }
    }, [navigate]);

    const handlemodelNameChange = (e) => {
        setmodelName(e.target.value);
    };

    const handlemodelSubmit = async (e) => {
        e.preventDefault();
		if(modelName.length > 32) {
			setError("model name is too long.");
			return;
		}
        try {
            const response = await axios.post('/api/models/', { name: modelName });
            setmodels([...models, response.data]);
            setmodelName('');
        } catch (error) {
            setError("There was an error creating the model.");
            console.error(error);
        }
    };

    return (
        <center>
            <div>
                <h2>Models</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <h3>Your models</h3>
                {models.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {models.map(model => (
                            <li key={model.id} style={{ margin: '10px 0' }}>
                                <button class="button2" onClick={() => navigate(`/models/${model.id}`, {state: {name: model.name}})}>
                                    {model.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No models available.</p>
                )}
                            <Spacer size={50} />

                <h3>Create model</h3>
                <form onSubmit={handlemodelSubmit}>
                    <label>
                        <p>Name:</p>
                        <input type="text" value={modelName} onChange={handlemodelNameChange} required />
                    </label>
                    <br /><br />
                    <button class="button" type="submit">Create</button>
                </form>
            </div>
        </center>
    );
};

export default Models;
