import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from './axiosConfig';
import './DatasetDetail.css';

const DatasetDetail = () => {
    const { datasetId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [newLabel, setNewLabel] = useState('');
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const datasetName = location.state?.name || '';

    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
            navigate('/');
        } else {
            axios.get(`/api/datasets/${datasetId}/photos/`)
                .then(response => {
                    setPhotos(response.data);
                })
                .catch(error => {
                    setError("There was an error fetching the dataset.");
                    console.error(error);
                });
        }
    }, [datasetId, navigate]);

    const handleEditClick = (photo) => {
        setSelectedPhoto(photo);
        setNewLabel(photo.label);
        setShowEditModal(true);
    };

    const handleSaveLabel = (e) => {
		e.preventDefault();
        axios.put(`/api/photos/${selectedPhoto.id}/`, { label: newLabel })
            .then(response => {
                setPhotos(photos.map(photo => 
                    photo.id === selectedPhoto.id ? { ...photo, label: newLabel } : photo
                ));
                setShowEditModal(false);
                setSelectedPhoto(null);
            })
            .catch(error => {
                setError("There was an error updating the label.");
                console.error(error);
            });
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedPhoto(null);
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

    const handleDeleteClick = (photo) => {
        setSelectedPhoto(photo);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        axios.delete(`/api/photos/${selectedPhoto.id}/delete/`)
            .then(response => {
                setPhotos(photos.filter(photo => photo.id !== selectedPhoto.id));
                setShowDeleteModal(false);
                setSelectedPhoto(null);
            })
            .catch(error => {
                setError("There was an error deleting the photo.");
                console.error(error);
            });
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedPhoto(null);
    };

    return (
        <center>
            <div>
                <h2>{datasetName || datasetId}</h2>
				<br/>
				<button onClick={() => navigate(`/upload/${datasetId}`, { state: { name: datasetName } })} className="upload-button">
                    Upload
                </button>
				<button onClick={() => navigate('/datasets')} style={{ color: "white" }}>
					Back
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
                                    <th>Actions</th>
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
                                        <td>
                                            <button className="edit-button" onClick={() => handleEditClick(photo)}>
												Label
											</button>
											<button onClick={() => handleDeleteClick(photo)} className="delete-button">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No photos available.</p>
                )}
                
                {showEditModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseEditModal}>&times;</span>
                            <h2>Edit Label</h2>
							<form onSubmit={handleSaveLabel}>
							<label>
                            <input 
                                type="text" 
								placeholder="Label"
                                value={newLabel} 
                                onChange={(e) => setNewLabel(e.target.value)} 
                            />
							</label>
                            <button type="submit" style={{ color: "white", "margin-top": "10px" }}>Save</button>
							</form>
                        </div>
                    </div>
                )}

                {showImageModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseImageModal}>&times;</span>
                            <img src={imageUrl} alt="Selected" className="modal-image" />
                        </div>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseDeleteModal}>&times;</span>
                            <h2>Confirm Delete</h2>
                            <p>Are you sure you want to delete this photo?</p>
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

export default DatasetDetail;
