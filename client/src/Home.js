import React, { useState } from "react"; 
import axios from "axios";
import DisplayAnImage from './DisplayAnImage';
import Spacer from './Spacer';
import Animation from "./Animation";

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
            <Spacer size={10} />
            <p>File Type: {selectedFile.type}</p>
            <Spacer size={10} />
            <p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
            <Spacer size={40} />
            <button class="button" onClick={onFileUpload}>Upload!</button>
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

      <Spacer size={26} />

      <h3><center>Example AI Generated Image Description: </center></h3>

      <Spacer size={5} />

      {Animation()}

      <Spacer size={100} />

      <h1><center>Try it Yourself:</center></h1>

      <Spacer size={5} />

      <h2><center>Image Upload</center></h2>
      
      <center>
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
</center>

    </div>
    
  );
}

export default Home; 
