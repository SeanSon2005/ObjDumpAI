import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import './PublicProfile.css';

const PublicProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [publicDatasets, setPublicDatasets] = useState([]);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/user/${userId}/public-info`)
            .then(response => {
                setUsername(response.data.username);
                setPublicDatasets(response.data.public_datasets);
            })
            .catch(error => {
                setError("There was an error fetching the user's public information.");
                console.error(error);
            });
    }, [userId]);

    return (
        <center>
            <div>
                <h2>{username}'s Public Datasets</h2>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {publicDatasets.length > 0 ? (
                    <div className="table-container">
                        <table className="datasets-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Date Added</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {publicDatasets.map((dataset, index) => (
                                    <tr key={dataset.id}>
                                        <td><span className="text-hl">{index + 1}</span></td>
                                        <td><span className="text-hl">{dataset.name}</span></td>
                                        <td><span className="text-hl">{dataset.description}</span></td>
                                        <td><span className="text-hl">{dataset.created_at.split('T')[0]}</span></td>
                                        <td>
                                            <button 
                                                onClick={() => navigate(`/readonly/${dataset.id}`)} 
                                                className="view-button"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No public datasets available.</p>
                )}
            </div>
        </center>
    );
};

export default PublicProfile;
