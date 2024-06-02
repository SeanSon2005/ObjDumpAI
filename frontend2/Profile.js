import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Spacer from './Spacer';

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

    const Divider = () => {
        return (
            <hr
                style={{ borderTop: "2px solid blue", 
                        maxWidth: "900px",
                }}
            ></hr>
        );
      };

    return (
        <center>
            <div>
                <h2>Profile</h2>
                {username ? (
                    <p><h3>Welcome, {username}!</h3></p>
                ) : (
                    <p>Welcome!</p>
                )}
                      <Spacer size={10} />

             <h3>{username}'s biography:</h3>

             <Spacer size={90} />
                <Divider />
                <Spacer size={20} />

             <h3>My Datasets:</h3>

                <button class="button" onClick={handleGoToDatasets}>Manage Datasets</button>
                <Spacer size={20} />

            </div>
        </center>
    );
};

export default Profile;
