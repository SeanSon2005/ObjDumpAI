import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import './Datasets.css';

const Datasets = () => {
    const navigate = useNavigate();
    const [datasets, setDatasets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
            navigate('/');
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

    return (
        <center>
            <div>
                <h2>Your Datasets</h2>
				<br/>
				<button onClick={() => navigate('/create')} className="new-dataset-button">
                    New Dataset
                </button>
				<br/>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {datasets.length > 0 ? (
                    <div className="table-container">
                        <table className="datasets-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Date Added</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datasets.map((dataset, index) => (
                                    <tr key={dataset.id}>
                                        <td><span className="text-hl">{index + 1}</span></td>
                                        <td><span className="text-hl">{dataset.name}</span></td>
                                        <td><span className="text-hl">{dataset.description}</span></td>
                                        <td><span className="text-hl">{dataset.created_at.split('T')[0]}</span></td>
                                        <td>
                                            <button onClick={() => navigate(`/datasets/${dataset.id}`, { state: { name: dataset.name } })} className="view-button">
                                                Manage
                                            </button>
											<button onClick={() => navigate(`/delete/${dataset.id}`, { state: { name: dataset.name } })} className="delete-button">
												Delete
											</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No datasets available.</p>
                )}
            </div>
        </center>
    );
};

export default Datasets;
