import React, { useEffect, useState } from 'react';
import axios from './axiosConfig';
import './Gallery.css';

const UserPhotoGallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserPhotos = async () => {
            try {
                const datasetsResponse = await axios.get('/api/datasets');
                const datasets = datasetsResponse.data;

                const photoPromises = datasets.map(async (dataset) => {
                    const photosResponse = await axios.get(`/api/datasets/${dataset.id}/photos/`);
                    const photosWithBlob = await Promise.all(
                        photosResponse.data.map(photo =>
                            axios.get(photo.image, { responseType: 'blob' }).then(imageResponse => ({
                                ...photo,
                                imageUrl: URL.createObjectURL(imageResponse.data),
                            }))
                        )
                    );
                    return photosWithBlob;
                });
                const allPhotos = (await Promise.all(photoPromises)).flat();
                setPhotos(allPhotos);
                setLoading(false);
            } catch (error) {
                console.error("There was an error fetching the photos.", error);
                setLoading(false);
            }
        };

        getUserPhotos();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="photo-gallery">
            {photos.length !== 0 ? (
                photos.map((photo, index) => (
                    <div key={index} className="photo">
                        <img src={photo.imageUrl} alt={photo.label} />
                        <div className="photo-label">{photo.label}</div>
                    </div>
                ))
            ) : (
                <p>No photos available.</p>
            )}
        </div>
    );
};

export default UserPhotoGallery;
