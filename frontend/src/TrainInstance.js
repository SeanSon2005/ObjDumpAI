import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import './TrainInstance.css';

const TrainInstance = () => {
    const { trainingId } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState(null);
    const [liveData, setLiveData] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);

    const fetchTraining = () => {
        axios.get(`/api/trainings/${trainingId}/`)
            .then(response => {
                setTraining(response.data);
            })
            .catch(error => {
                setError("There was an error fetching the training instance.");
                console.error(error);
            });
    };

    const fetchLiveData = () => {
        axios.get(`/api/trainings/${trainingId}/live/`)
            .then(response => {
                setLiveData(response.data);
            })
            .catch(error => {
                setError("There was an error fetching live training data.");
                console.error(error);
            });
    };

    const fetchAnnotatedPhotos = () => {
        axios.get(`/api/trainings/${trainingId}/annotated/`)
            .then(response => {
                setPhotos(response.data);
            })
            .catch(error => {
                setError("There was an error fetching annotated photos.");
                console.error(error);
            });
    };

    const downloadModel = () => {
        axios.get(`/api/trainings/${trainingId}/model`, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `model_${trainingId}.zip`);
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => {
                setError("There was an error downloading the model.");
                console.error(error);
            });
    };

    useEffect(() => {
        fetchTraining();
        const intervalId = setInterval(fetchLiveData, 10000);
        return () => clearInterval(intervalId);
    }, [trainingId]);

    useEffect(() => {
        if (training && training.status === 'COMPLETED') {
            fetchAnnotatedPhotos();
        }
    }, [training]);

    return (
        <center>
            <div>
                {error && <p className="train-error">{error}</p>}
                {training && (
                    <>
                        <h2>Training Instance Details</h2>
                        <div className="train-meta-table-container">
                            <table className="train-meta-table">
                                <tbody>
                                    <tr>
                                        <td>ID:</td>
                                        <td>{training.id}</td>
                                    </tr>
                                    <tr>
                                        <td>Keywords:</td>
                                        <td>{training.keywords.join(', ')}</td>
                                    </tr>
                                    <tr>
                                        <td>Date Created:</td>
                                        <td>{new Date(training.created_at).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Status:</td>
                                        <td>{training.status}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {training.status === 'PENDING' && (
                            <>
                                <h3>Training in Progress</h3>
                                {liveData && (
                                    <div className="train-grid-container">
                                        <div>Epoch: {liveData.Epoch}</div>
                                        <div>Current Batch: {liveData["Current Batch"]}</div>
                                        <div>Total Batches: {liveData["Total Batches"]}</div>
                                        <div>Training Loss: {liveData["Training Loss"]}</div>
                                        <div>Validation Loss: {liveData["Validation Loss"]}</div>
                                        <div>Metrics: {liveData.Metrics}</div>
                                    </div>
                                )}
                            </>
                        )}
                        {training.status === 'COMPLETED' && (
                            <>
                                <h3>Annotated Photos</h3>
                                <div className="train-table-container">
                                    <table className="train-detail-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Image</th>
                                                <th>Label</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {photos.map((photo, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <a href={photo.image} target="_blank" rel="noopener noreferrer">
                                                            View Image
                                                        </a>
                                                    </td>
                                                    <td>{photo.label}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button onClick={downloadModel} className="train-download-button">
                                    Download Model
                                </button>
                            </>
                        )}
                    </>
                )}
                <button onClick={() => navigate(-1)} className="train-back-button">
                    Back
                </button>
            </div>
        </center>
    );
};

export default TrainInstance;
