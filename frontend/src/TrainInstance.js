import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import './TrainInstance.css';

const TrainInstance = () => {
    const { trainingId } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [error, setError] = useState(null);
    const [intervalId, setIntervalId] = useState(null);

    const fetchTraining = () => {
        axios.get(`/api/trainings/${trainingId}/`)
            .then(response => {
                const trainingData = response.data;
                setTraining(trainingData);

                if (trainingData.status === 'COMPLETED') {
                    clearInterval(intervalId);
                    fetchAnnotatedPhotos();
                }
            })
            .catch(error => {
                setError("There was an error fetching the training instance.");
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

    const calculateElapsedTime = () => {
        if (!training) return '';
        const createdAt = new Date(training.created_at);
        const completedAt = training.completed_at ? new Date(training.completed_at) : new Date();
        const elapsedTime = new Date(completedAt - createdAt);

        const hours = elapsedTime.getUTCHours();
        const minutes = elapsedTime.getUTCMinutes();
        const seconds = elapsedTime.getUTCSeconds();

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        fetchTraining();
        const id = setInterval(fetchTraining, 1000);
        setIntervalId(id);
        return () => clearInterval(id);
    }, [trainingId]);

    useEffect(() => {
        if (training && training.status === 'COMPLETED') {
            clearInterval(intervalId);
        }
    }, [training, intervalId]);

    const handleFilenameClick = (photo, event) => {
        event.preventDefault();
        axios.get(photo.image, { responseType: 'blob' })
            .then(imageResponse => {
                const imageUrl = URL.createObjectURL(imageResponse.data);
                setImageUrl(imageUrl);
                setShowImageModal(true);
            })
            .catch(error => {
                setError("There was an error fetching the image.");
                console.error(error);
            });
    };

    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setImageUrl('');
    };

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
                                        <td>Epochs:</td>
                                        <td>{training.epochs}</td>
                                    </tr>
                                    <tr>
                                        <td>Status:</td>
                                        <td
                                            style={{ color: (training.status === "COMPLETED") ? "green"
                                                : ((training.status === "PENDING") ? "yellow" : "red") }}
                                        >{training.status}</td>
                                    </tr>
                                    <tr>
                                        <td>Elapsed Time:</td>
                                        <td>{calculateElapsedTime()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        {training.status === 'PENDING' && (
                            <>
                                <h3 style={{ "font-size": "120%" }}>Training in Progress</h3>
                                <br />
                                <button onClick={() => navigate(-1)} className="train-back-button">
                                    Back
                                </button>
                            </>
                        )}
                        {training.status === 'COMPLETED' && (
                            <>
                                <h3 style={{ "font-size": "120%" }}>Annotated Photos</h3>
                                <br />
                                <button onClick={downloadModel} className="train-download-button">
                                    Download Model
                                </button>
                                <button onClick={() => navigate(-1)} className="train-back-button">
                                    Back
                                </button>
                                <br /><br />
                                {photos.length > 0 ? (
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
                                                        <td><span className="text-hl">{index + 1}</span></td>
                                                        <td>
                                                            <a className="image-link" href="#" onClick={(event) => handleFilenameClick(photo, event)} >
                                                                {photo.filename}
                                                            </a>
                                                        </td>
                                                        <td><span className="text-hl">{photo.label}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No photos available.</p>
                                )}
                                {showImageModal && (
                                    <div className="modal">
                                        <div className="modal-content">
                                            <span className="close" onClick={handleCloseImageModal}>&times;</span>
                                            <img src={imageUrl} alt="Selected" className="modal-image" />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
                {!training && (
                    <button onClick={() => navigate(-1)} className="train-back-button">
                        Back
                    </button>
                )}
            </div>
        </center>
    );
};

export default TrainInstance;
