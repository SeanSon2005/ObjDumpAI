import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import './Datasets.css';

const Datasets = () => {
    const navigate = useNavigate();
    const [datasets, setDatasets] = useState([]);
    const [error, setError] = useState(null);
    const [datasetName, setDatasetName] = useState('');
    const [datasetDesc, setDatasetDesc] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showVisibilityModal, setShowVisibilityModal] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState(null);

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
                setDatasets([...datasets, response.data]);
                setShowModal(false);
                setDatasetName('');
                setDatasetDesc('');
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

    const handleDeleteClick = (dataset) => {
        setSelectedDataset(dataset);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await axios.delete(`/api/datasets/${selectedDataset.id}/detail/`);
            if (response.status === 204) {
                setDatasets(datasets.filter(dataset => dataset.id !== selectedDataset.id));
                setShowDeleteModal(false);
                setSelectedDataset(null);
            } else {
                setError('There was an error deleting the dataset.');
            }
        } catch (error) {
            setError('There was an error deleting the dataset.');
            console.error(error);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedDataset(null);
    };

    const handleVisibilityClick = (dataset) => {
        setSelectedDataset(dataset);
        setShowVisibilityModal(true);
    };

    const handleConfirmToggleVisibility = async () => {
        try {
            const response = await axios.post(`/api/datasets/${selectedDataset.id}/toggle-publicity/`);
            if (response.status === 200) {
                setDatasets(datasets.map(dataset => 
                    dataset.id === selectedDataset.id ? { ...dataset, public: !dataset.public } : dataset
                ));
                setShowVisibilityModal(false);
                setSelectedDataset(null);
            } else {
                setError('There was an error toggling the visibility.');
            }
        } catch (error) {
            setError('There was an error toggling the visibility.');
            console.error(error);
        }
    };

    const handleCloseVisibilityModal = () => {
        setShowVisibilityModal(false);
        setSelectedDataset(null);
    };


    return (
		<center>
        <div className="full-window-container">
            <div className="content-container">
                <div className="header-container">
                    <h2>Your Datasets</h2>
                    <button onClick={() => setShowModal(true)} className="new-dataset-button">
                        New Dataset
                    </button>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {datasets.length > 0 ? (
                    <div className="table-container">
                        <table className="datasets-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Date Added</th>
                                    <th>Visibility</th>
                                    <th>Actions</th>
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
                                            <button onClick={() => handleVisibilityClick(dataset)} className="vis-button">
                                                {dataset.public ? "Public" : "Private"}
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => navigate(`/datasets/${dataset.id}`, { state: { name: dataset.name } })} className="manage-button">
                                                Manage
                                            </button>
                                            <button onClick={() => handleDeleteClick(dataset)} className="delete-button">
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

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                            <h2>New Dataset</h2>
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
                                <button type="submit">Create</button>
                            </form>
                        </div>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseDeleteModal}>&times;</span>
                            <h2>Confirm Delete</h2>
                            <p>Are you sure you want to delete dataset: {selectedDataset?.name}?</p>
                            <button onClick={handleConfirmDelete} className="delete-button">
                                Yes
                            </button>
                            <button onClick={handleCloseDeleteModal} style={{ color: "white" }}>
                                No
                            </button>
                        </div>
                    </div>
                )}

                {showVisibilityModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseVisibilityModal}>&times;</span>
                            <h2>Confirm Visibility</h2>
                            <p>Are you sure you want to make the dataset: {selectedDataset?.name} {selectedDataset?.public ? 'private' : 'public'}?</p>
                            <button onClick={handleConfirmToggleVisibility} className="delete-button">
                                Yes
                            </button>
                            <button onClick={handleCloseVisibilityModal} style={{ color: "white" }}>
                                No
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
		</center>
    );
};



export default Datasets;

