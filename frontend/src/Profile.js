import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig';

const Profile = () => {
	const navigate = useNavigate();
	const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);

	useEffect(() => {
		if(!localStorage.getItem('token') || !localStorage.getItem('username')) {
			navigate('/login');
		} else {
			axios.get('/api/photos')
				.then(response => {
					setPhotos(response.data);
				})
				.catch(error => {
                    setError("There was an error fetching the photos.");
					console.error(error);
				});
		}
	}, [navigate]);

    const username = localStorage.getItem('username');

    return (
        <center><div>
            <h2>Profile</h2>
            {username ? (
                <p>Welcome, {username}!</p>
            ) : (
                <p>Welcome!</p>
            )}
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<h3>Your Photos</h3>
			{photos.length > 0 ? (
				<ul>
					{photos.map(photo => (
						<li key={photo.id}>
							<img src={photo.image} alt={photo.label} width="100" />
							<p>{photo.label}</p>
						</li>
					))}
				</ul>
			) : (
				<p>No photos available.</p>
			)}
        </div></center>

    );
};

export default Profile;
