import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import './DatasetReadonly.css';

const DatasetReadonly = () => {
    const { datasetId } = useParams();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [error, setError] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
	const [datasetName, setDatasetName] = useState(null);
	const [ownerId, setOwnerId] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
            navigate('/');
        } else {
			datasetMeta();
            fetchPhotos();
        }
    }, [datasetId, navigate]);

	const datasetMeta = () => {
		if(!datasetName || !ownerId) {
			axios.get(`/api/datasets/${datasetId}/public/`)
				.then(response => {
					setDatasetName(response.data.name);
					setOwnerId(response.data.user);
				})
				.catch(error => {
					setError("There was an error fetching the dataset.");
					console.error(error);
				})
		}
	}

    const fetchPhotos = () => {
        axios.get(`/api/datasets/${datasetId}/photos/`)
            .then(response => {
                setPhotos(response.data);
            })
            .catch(error => {
                setError("There was an error fetching the dataset.");
                console.error(error);
            });
    };

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
                <h2>{datasetName}</h2>
                <br/>
                <button onClick={() => navigate(`/user/${ownerId}`)} className="owner-button">
                    Owner
                </button>
				<button onClick={() => navigate(`/train/${datasetId}`)} className="train-button">
                    Trainings
                </button>
                <br/>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {photos.length > 0 ? (
                    <div className="table-container">
                        <table className="detail-table">
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
                                            <a className="image-link" href="#" onClick={(event) => handleFilenameClick(photo, event)}>
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
            </div>
        </center>
    );
};

export default DatasetReadonly;
