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
    const handleGoToLogout = () => {
        navigate('/logout');
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
                <h2>My Profile</h2>
                {username ? (
                    <p><h3>Welcome back, {username}!</h3></p>
                ) : (
                    <p>Welcome!</p>
                )}
                      <Spacer size={10} />

             <h3>{username}'s Datasets:</h3>
                <button class="button" onClick={handleGoToDatasets}>Manage Datasets</button>
                <Spacer size={100} />

                <Divider />

                <Spacer size={70} />

                <button class="button" onClick={handleGoToLogout}>Logout</button>

                <Spacer size={90} />

                
                <Spacer size={50} />

            </div>
        </center>
    );
};

export default Profile;
