import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from './axiosConfig';
import JSZip from 'jszip';
import './DatasetUpload.css';
import Spacer from './Spacer';

const DatasetUpload = () => {
    const { datasetId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [files, setFiles] = useState(null);
	const [datasetName, setDatasetName] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
            navigate('/');
        } else {
			datasetMeta();
		}
    }, [navigate]);

	const datasetMeta = () => {
		if(!datasetName) {
			axios.get(`/api/datasets/${datasetId}/public/`)
				.then(response => {
					setDatasetName(response.data.name);
				})
				.catch(error => {
					setError("There was an error fetching the dataset.");
					console.error(error);
				})
		}
	}

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);
        setSuccess(null);

        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'application/zip') {
                await handleZipFile(file);
            } else if (file.type.startsWith('image/')) {
                await handleSingleImage(file);
            } else {
                setError('Please upload a valid image or ZIP file.');
            }
        } else {
            setError('Please select a file to upload.');
        }
    };

    const handleZipFile = async (file) => {
        const zip = new JSZip();

        try {
            const content = await file.arrayBuffer();
            const unzipped = await zip.loadAsync(content);

            for (const filename of Object.keys(unzipped.files)) {
                const file = unzipped.files[filename];
                if (!file.dir) {
                    const fileData = await file.async('blob');
                    await uploadImage(fileData, filename);
                }
            }
        } catch (error) {
            setError('There was an error processing the ZIP file.');
        }
    };

    const handleSingleImage = async (file) => {
        await uploadImage(file, file.name);
    };

    const uploadImage = async (fileData, filename) => {
        const formData = new FormData();
        formData.append('image', fileData, filename);
        formData.append('label', "");

        try {
            await axios.post(`/api/datasets/${datasetId}/photos/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess((prevSuccess) => (prevSuccess ? `${prevSuccess}\n${filename} uploaded successfully.` : `${filename} uploaded successfully.`));
        } catch (error) {
            setError((prevError) => (prevError ? `${prevError}\nError uploading ${filename}.` : `Error uploading ${filename}.`));
        }
    };

    return (
        <center>
            <div className="grid" id="dataset-upload">
                <span className="close" onClick={() => { navigate(`/datasets/${datasetId}`, {state: {name: datasetName}}) }}>&times;</span>
                <h2>Upload Data</h2>
				<h6>{`Dataset: ${datasetName}`}</h6>
                <h3 style={{ 'fontSize': '100%' }}>Upload individual image files or a zip file containing multiple images at the top level.</h3>
                <Spacer size={30} />
                <form onSubmit={handleSubmit}>
                    <label>
                        <input class="button"
                            type="file"
                            onChange={handleFileChange}
                            accept=".zip,image/*"
                        />
                    </label>
                    <Spacer size={30} />

                    <br/>
                    <button class="button">Upload</button>
                    <Spacer size={50} />
                </form>
				<div className="message-container">
					{success && <pre style={{ color: '#22de33' }}>{success}</pre>}
					{error && <pre style={{ color: 'red' }}>{error}</pre>}
				</div>
                <br />
            </div>
        </center>
    );
};

export default DatasetUpload;
