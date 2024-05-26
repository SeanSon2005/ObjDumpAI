import React, { useState } from "react"; 
import axios from "axios";
import DisplayAnImage from './DisplayAnImage';
import Spacer from './Spacer';


function Home() {
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
            <p>File Type: {selectedFile.type}</p>
            <p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
            <button onClick={onFileUpload}>Upload!</button>
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
    <div className="content"> 
      <div>
        <h2><center>Explore the World with the Power of AI</center></h2>
        <div>{DisplayAnImage()}</div> 
      </div>

      <h3><center>AI Generated Image Description: </center></h3>
      <h4><center>{description}</center></h4> 

      <Spacer size={56} />
      <h2><center>Try it Yourself:</center></h2>
      <h5><center>Image Upload</center></h5>
      <center>
        <input type="file" onChange={onFileChange} />
        {fileData()} 
      </center>
    </div>
  );
}

export default Home; 
