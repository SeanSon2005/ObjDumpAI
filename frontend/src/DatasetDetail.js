import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from './axiosConfig';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './DatasetDetail.css';

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
            navigate('/');
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

		if(label.length > 80) {
			setError("Label name is too long.")
			return;
		}

        const formData = new FormData();
        formData.append('image', image);
        formData.append('label', label);

        try {
            const response = await axios.post(`/api/datasets/${datasetId}/photos/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newPhoto = await axios.get(response.data.image, { responseType: 'blob' }).then(imageResponse => ({
                ...response.data,
                imageUrl: URL.createObjectURL(imageResponse.data),
            }));
            setPhotos([...photos, newPhoto]);
            setImage(null);
            setLabel('');
			setError(null);
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
                {photos.length > 0 ? (
                    <div className="gallery-container">
                        <Carousel showArrows={true} showThumbs={false} infiniteLoop={true}>
                            {photos.map((photo, index) => (
                                <div key={index} className="slider-item">
                                    <img src={photo.imageUrl} alt={photo.label} />
                                    <div className="image-label">{photo.label}</div>
                                </div>
                            ))}
                        </Carousel>
                    </div>
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
