import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from './axiosConfig';

const DatasetDetail = () => {
    const { datasetId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [label, setLabel] = useState('');
    const datasetName = location.state?.name || '';

    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
            navigate('/login');
        } else {
            axios.get(`/api/datasets/${datasetId}/photos/`)
                .then(response => {
					const photoPromises = response.data.map(photo =>
                        axios.get(photo.image, { responseType: 'blob' }).then(imageResponse => ({
                            ...photo,
                            imageUrl: URL.createObjectURL(imageResponse.data),
                        }))
                    );
					Promise.all(photoPromises)
						.then(photosWithBlob => {
							setPhotos(photosWithBlob);
						})
						.catch(error => {
							setError("There was an error fetching the photos.");
							console.error(error);
						});
                })
				
        }
    }, [datasetId, navigate]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleLabelChange = (e) => {
        setLabel(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);
        formData.append('label', label);

        try {
            const response = await axios.post(`/api/datasets/${datasetId}/photos/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newPhoto = {
                ...response.data,
                imageUrl: URL.createObjectURL(new Blob([response.data.image], { type: response.data.imageType })),
            };
            setPhotos([...photos, newPhoto]);

            setImage(null);
            setLabel('');
        } catch (error) {
            setError("There was an error uploading the photo.");
            console.error(error);
        }
    };

    return (
        <center>
            <div>
                <h2>{datasetName || datasetId}</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <h3>Your Photos</h3>
                {photos.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {photos.map(photo => (
                            <li key={photo.id} style={{ margin: '10px 0' }}>
                                <img src={photo.imageUrl} alt={photo.label} width="100" />
                                <p>{photo.label}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No photos available.</p>
                )}
                <h3>Upload Photo</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        <p>Image:</p>
                        <input type="file" onChange={handleImageChange} required />
                    </label>
                    <label>
                        <p>Label:</p>
                        <input type="text" value={label} onChange={handleLabelChange} />
                    </label>
                    <br /><br />
                    <button type="submit">Upload</button>
                </form>
            </div>
        </center>
    );
};

export default DatasetDetail;
