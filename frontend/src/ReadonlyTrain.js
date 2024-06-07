import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import './DatasetTrain.css';

const ReadonlyTrain = () => {
    const { datasetId } = useParams();
    const navigate = useNavigate();
    const [trainings, setTrainings] = useState([]);
    const [keywords, setKeywords] = useState(['']);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [datasetName, setDatasetName] = useState(null);

    const datasetMeta = useCallback(() => {
        if (!datasetName) {
            axios.get(`/api/datasets/${datasetId}/public/`)
                .then(response => {
                    setDatasetName(response.data.name);
                })
                .catch(error => {
                    setError("There was an error fetching the dataset.");
                    console.error(error);
                });
        }
    }, [datasetId, datasetName]);

    const fetchTrainings = useCallback(() => {
        axios.get(`/api/datasets/${datasetId}/trainings/`)
            .then(response => {
                setTrainings(response.data);
            })
            .catch(error => {
                setError("There was an error fetching the training instances.");
                console.error(error);
            });
    }, [datasetId]);

    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
            navigate('/');
        } else {
            fetchTrainings();
            datasetMeta();
        }
    }, [datasetId, navigate, fetchTrainings, datasetMeta]);

    const handleCreateClick = () => {
        setShowCreateModal(true);
    };

    const handleSaveTraining = (e) => {
        e.preventDefault();
        const validKeywords = keywords.filter(kw => kw.trim().length > 0 && !kw.includes(',') && kw.length <= 20);
        if (validKeywords.length === 0) {
            setError("Please enter at least one valid keyword.");
            return;
        }
        if (validKeywords.length > 10) {
            setError("You can enter a maximum of 10 keywords.");
            return;
        }
        axios.post(`/api/datasets/${datasetId}/train/`, { keywords: validKeywords })
            .then(response => {
                setTrainings([...trainings, response.data]);
                setShowCreateModal(false);
                setKeywords(['']);
                setError(null);
            })
            .catch(error => {
                setError("There was an error creating the training instance.");
                console.error(error);
            });
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setKeywords(['']);
    };

    const handleKeywordChange = (index, value) => {
        const newKeywords = [...keywords];
        newKeywords[index] = value;
        setKeywords(newKeywords);
    };

    const addKeywordField = () => {
        if (keywords.length < 10) {
            setKeywords([...keywords, '']);
        }
    };

    const removeKeywordField = (index) => {
        const newKeywords = keywords.filter((_, i) => i !== index);
        setKeywords(newKeywords);
    };

    const handleDeleteClick = (training) => {
        setSelectedTraining(training);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        axios.delete(`/api/datasets/${datasetId}/trainings/delete/${selectedTraining.id}/`)
            .then(response => {
                setTrainings(trainings.filter(training => training.id !== selectedTraining.id));
                setShowDeleteModal(false);
                setSelectedTraining(null);
            })
            .catch(error => {
                setError("There was an error deleting the training instance.");
                console.error(error);
            });
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedTraining(null);
    };

    return (
        <center>
            <div>
                <h2>{datasetName}</h2>
                <br/>
                <button onClick={() => navigate(-1)} style={{ color: "white" }}>
                    Back
                </button>
                <br/><br/>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {trainings.length > 0 ? (
                    <div className="table-container">
                        <table className="train-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Keywords</th>
                                    <th>Date Added</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainings.map((training, index) => (
                                    <tr key={index}>
                                        <td><span className="text-hl">{index + 1}</span></td>
                                        <td><span className="text-hl">{training.keywords.join(', ')}</span></td>
                                        <td><span className="text-hl">{training.created_at.split('T')[0]}</span></td>
                                        <td>
                                            <button onClick={() => navigate(`/trainings/${training.id}`)} className="view-train-button">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No training instances available.</p>
                )}
                
                {showCreateModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseCreateModal}>&times;</span>
                            <h2>New Training Instance</h2>
                            <form onSubmit={handleSaveTraining}>
                                {keywords.map((keyword, index) => (
                                    <div key={index} className="keyword-field">
                                        <input 
                                            type="text" 
                                            placeholder="Keyword"
                                            value={keyword}
                                            maxLength="20"
                                            onChange={(e) => handleKeywordChange(index, e.target.value)}
                                        />
                                        <button type="button" onClick={() => removeKeywordField(index)} className="remove-button">-</button>
                                    </div>
                                ))}
                                {keywords.length < 10 && (
                                    <button type="button" onClick={addKeywordField} className="add-button">Add Keyword</button>
                                )}
                                <br/>
                                <button type="submit" style={{ color: "white", "margin-top": "10px" }}>Submit</button>
                            </form>
                        </div>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseDeleteModal}>&times;</span>
                            <h2>Confirm Delete</h2>
                            <p>Are you sure you want to delete this training instance?</p>
                            <button onClick={handleConfirmDelete} className="delete-button" style={{ color: "white", "margin-right": "10px" }}>
                                Yes
                            </button>
                            <button onClick={handleCloseDeleteModal} style={{ color: "white" }}>
                                No
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </center>
    );
};

export default ReadonlyTrain;
