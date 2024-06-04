import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from './axiosConfig';

const DatasetDelete = () => {
    const { datasetId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const datasetName = location.state?.name || '';

    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        if (confirmDelete) {
            handleDelete();
        }
    }, [confirmDelete]);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/api/datasets/${datasetId}/detail/`);
            if (response.status === 204) {
                navigate('/datasets');
            } else {
                setError('There was an error deleting the dataset');
            }
        } catch (e) {
            setError('There was an error deleting the dataset');
        }
    };

    const handleConfirm = () => {
        setConfirmDelete(true);
    };

    const handleCancel = () => {
        setConfirmDelete(false);
        navigate('/datasets');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!confirmDelete ? (
                <>
                    <p>{`Are you sure you want to delete dataset: ${datasetName}?`}</p>
                    <button onClick={handleConfirm} style={{ marginRight: '10px' }}>Yes</button>
                    <button onClick={handleCancel}>No</button>
                </>
            ) : (
				<>
				</>
            )}
        </div>
    );
};

export default DatasetDelete;
