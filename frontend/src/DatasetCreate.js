import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig';

const DatasetCreate = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [datasetName, setDatasetName] = useState('');
    const [datasetDesc, setDatasetDesc] = useState('');

    const handleDatasetSubmit = async (e) => {
        e.preventDefault();
		if(!datasetName) {
			setError("Dataset name is required.");
			return;
		}
		if(datasetName.length > 32) {
			setError("Dataset name is too long.");
			return;
		}
        try {
            const response = await axios.post('/api/datasets/', { name: datasetName, description: datasetDesc });
        } catch (error) {
            setError("There was an error creating the dataset.");
            console.error(error);
        }
    };

    return (
        <center>
            <div>
                <h2>Create New Dataset</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
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
							placeholder="Description (optional)"
							value={datasetDesc}
							onChange={(e) => setDatasetDesc(e.target.value)}
						/>
                    </label>
                    <br/><br/>
                    <button type="submit">Create</button>
                </form>
            </div>
        </center>
    );
};

export default DatasetCreate;
