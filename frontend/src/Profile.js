import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

	useEffect(() => {
		if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
			navigate('/');
		}
	}, [navigate]);

    const handleGoToDatasets = () => {
        navigate('/datasets');
    };

    return (
        <center>
            <div>
                {username ? (
                    <h2>Welcome, {username}!</h2>
                ) : (
                    <h2>Welcome!</h2>
                )}
				<br/>
                <button onClick={handleGoToDatasets}>Manage Datasets</button>
            </div>
        </center>
    );
};

export default Profile;
