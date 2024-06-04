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
				<button onClick={() => navigate(`/upload/${datasetId}`, { state: { name: datasetName } })} className="upload-button">
						Upload Data
				</button>
            </div>
        </center>
    );
};

export default DatasetDetail;
