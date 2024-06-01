import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig';

const Datasets = () => {
    const navigate = useNavigate();
    const [datasets, setDatasets] = useState([]);
    const [error, setError] = useState(null);
    const [datasetName, setDatasetName] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
            navigate('/login');
        } else {
            axios.get('/api/datasets/')
                .then(response => {
                    setDatasets(response.data);
                })
                .catch(error => {
                    setError("There was an error fetching the datasets.");
                    console.error(error);
                });
        }
    }, [navigate]);

    const handleDatasetNameChange = (e) => {
        setDatasetName(e.target.value);
    };

    const handleDatasetSubmit = async (e) => {
        e.preventDefault();
		if(datasetName.length > 32) {
			setError("Dataset name is too long.");
			return;
		}
        try {
            const response = await axios.post('/api/datasets/', { name: datasetName });
            setDatasets([...datasets, response.data]);
            setDatasetName('');
        } catch (error) {
            setError("There was an error creating the dataset.");
            console.error(error);
        }
    };

    return (
        <center>
            <div>
                <h2>Datasets</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <h3>Your Datasets</h3>
                {datasets.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {datasets.map(dataset => (
                            <li key={dataset.id} style={{ margin: '10px 0' }}>
                                <button onClick={() => navigate(`/datasets/${dataset.id}`, {state: {name: dataset.name}})}>
                                    {dataset.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No datasets available.</p>
                )}
                <h3>Create Dataset</h3>
                <form onSubmit={handleDatasetSubmit}>
                    <label>
                        <p>Name:</p>
                        <input type="text" value={datasetName} onChange={handleDatasetNameChange} required />
                    </label>
                    <br /><br />
                    <button type="submit">Create</button>
                </form>
            </div>
        </center>
    );
};

export default Datasets;