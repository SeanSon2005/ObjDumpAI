import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

	useEffect(() => {
		if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
			navigate('/login');
		}
	}, [navigate]);

    const handleGoToDatasets = () => {
        navigate('/datasets');
    };

    return (
        <center>
            <div>
                <h2>Profile</h2>
                {username ? (
                    <p>Welcome, {username}!</p>
                ) : (
                    <p>Welcome!</p>
                )}
                <button onClick={handleGoToDatasets}>Manage Datasets</button>
            </div>
        </center>
    );
};

export default Profile;
