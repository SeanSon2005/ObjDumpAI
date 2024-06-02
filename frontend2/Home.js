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
    <div className="content"> 
      <div>
        <h2><center>Explore the World with AI</center></h2>
        <div>{DisplayAnImage()}</div> 
      </div>

      <Spacer size={30} />

      <h3><center>Example AI Generated Image Description: </center></h3>

      <Spacer size={5} />

      {Animation()}  

      <Spacer size={90} />

      <Divider />

      <Spacer size={80} />

      <h2><center>Try it Yourself:</center></h2>

      <h1><center>Image Upload</center></h1>
      
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

     <Divider />

      <Spacer size={70} />

      <h1><center>Advanced Image Detection for the Future of Computing</center></h1>
      <Spacer size={20} />

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '40%' }}>
          <h3>Object Detection Models: The Power Behind the Magic</h3>
          <Spacer size={20} />
          <p>
            <h7>Object detection is at the forefront of AI innovation. State-of-the-art models like YOLO and SSD are revolutionizing industries from self-driving cars to medical imaging. 
              These models are incredibly fast and accurate, able to locate and classify multiple objects within an image in real-time. We harness the power of these advanced models to provide you with unparalleled object detection capabilities.</h7>
          </p>
        </div>

        <div style={{ width: '40%' }}>
          <h3>Open Source: Democratizing AI for Everyone</h3>
          <p>
          <Spacer size={20} />

            <h7>We believe in the power of open source software to drive collaboration and innovation. 
              Our platform is built on open source technologies, and we encourage you to explore the code and contribute to the community. 
              By leveraging the open source ecosystem, we can collectively push the boundaries of what's possible 
              in computer vision and make Artificial Intelligence technologies accessible to everyone.
            </h7>
          </p>
      
        </div>
      </div>
      <Divider />

      <Spacer size={50} />

      <h1>Real-World Applications: Making a Difference</h1>
      <Spacer size={30} />

      <p>
        <h3>Object detection is more than just cool technology — it's changing the way we live and work. 
          Here are a few examples of how our platform can be used in the real world:</h3>
      </p>
      <Spacer size={20} />
      <h7>Autonomous Vehicles:   Detecting pedestrians and traffic signs to ensure safe driving.<br></br><br></br>
      Medical Imaging:   Identifying tumors and other anomalies in X-rays and scans.<br></br><br></br>
      Security Systems:   Monitoring surveillance footage for suspicious activity.<br></br><br></br>
      Retail Analytics:   Analyzing customer behavior in stores.<br></br><br></br>
      Agriculture:   Monitoring crop health and detecting pests.</h7>

      <Divider />
      <Spacer size={50} />

      <p><h1>The possibilities are endless, and we're excited to see what you create!</h1></p>
      <Spacer size={50} />
      <Divider />
      <Spacer size={50} />

      </center>

    </div>
    
  );
}

const Divider = () => {
  return (
      <hr
          style={{ borderTop: "2px solid blue" }}
      ></hr>
  );
};

export default Home; 