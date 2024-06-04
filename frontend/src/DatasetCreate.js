import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import './DatasetCreate.css';

const DatasetCreate = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [datasetName, setDatasetName] = useState('');
    const [datasetDesc, setDatasetDesc] = useState('');

    const handleDatasetSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!datasetName) {
            setError("Dataset name is required.");
            return;
        }
        if (datasetName.length > 32) {
            setError("Dataset name is too long.");
            return;
        }
        try {
            const response = await axios.post('/api/datasets/', { name: datasetName, description: datasetDesc });
            if (response.status === 201) {
                navigate('/datasets');
            } else {
                setError(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            if (error.response) {
                setError(`Error: ${error.response.data.detail || 'There was an error creating the dataset.'}`);
            } else if (error.request) {
                setError('No response received from the server.');
            } else {
                setError('Error: Unable to create the dataset.');
            }
            console.error(error);
        }
    };

    return (
        <center>
            <div className="grid" id="dataset-create">
                <h2>Create New Dataset</h2>
                <form onSubmit={handleDatasetSubmit}>
                    <label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={datasetName}
                            onChange={(e) => setDatasetName(e.target.value)}
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            placeholder="Description"
                            value={datasetDesc}
                            onChange={(e) => setDatasetDesc(e.target.value)}
                        />
                    </label>
                    <br/>
                    <button type="submit">Create</button>
                </form>
				{error && <p style={{ color: 'red' }}>{error}</p>}
                <br />
            </div>
        </center>
    );
};

export default DatasetCreate;
