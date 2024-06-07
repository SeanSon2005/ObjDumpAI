import React, { useState } from 'react';
import axios from './axiosConfig';
import { useNavigate } from 'react-router-dom';
import Spacer from './Spacer';

const Detection = () => {

    const navigate = useNavigate();

    const routeChange = () =>{ 
        let path = 'register'; 
        navigate(path);
      }
      const [selectedFile, setSelectedFile] = useState(null); 
      const [description] = useState("A towering skyscraper rises above the vast city skyline");
    
      const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
      };
    
      const onFileUpload = () => {
        const formData = new FormData();
        formData.append("myFile", selectedFile, selectedFile.name);
        axios.post("api/uploadfile", formData);
      };
    
      const fileData = () => {
        if (selectedFile) {
          return (
            <center>
              <div>
                <h2>File Details:</h2>
                <p>File Name: {selectedFile.name}</p>
                <Spacer size={10} />
                <p>File Type: {selectedFile.type}</p>
                <Spacer size={10} />
                <p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
                <Spacer size={40} />
                <button class="button" onClick={onFileUpload}>Upload!</button>
                <Spacer size={90} />
    
              </div>
            </center>
          );
        } else {
          return (
            <div>
              <br />
              <h4></h4> 
            </div>
          );
        }
      };

    return (
		<center><div>
        <h2>Image Detection</h2>

        <Spacer size={10} />

        <h3><center>Detect objects with our built-in image to text model! </center></h3>
        <Spacer size={60} />


        <h1><center>Image Upload</center></h1>

        <label htmlFor="fileInput" class="button">
        Choose File
        </label>
        <input
        type="file"
        id="fileInput"
        onChange={onFileChange}
        style={{ display: 'none' }}
        />

        {fileData()}

        <Spacer size={50} />

        </div></center>
        );
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

export default Detection;

