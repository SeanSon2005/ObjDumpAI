import Navbar from './Navbar';
import axios from "axios";
import React, { Component } from "react";
import DisplayAnImage from './DisplayAnImage';
 
var description = "A towering skyscraper rises above the vast city skyline";

class App extends Component {
    state = {
        selectedFile: null,
    };

    
    onFileChange = (event) => {
        this.setState({
            selectedFile: event.target.files[0],
        });
    };
 
    onFileUpload = () => {
        const formData = new FormData();
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
 
        console.log(this.state.selectedFile);
 
        axios.post("api/uploadfile", formData);
    };
    
    fileData = () => {
      if (this.state.selectedFile) {
          return (
            <center>
              <div>
                  <h2>File Details:</h2>
                  <p>
                      File Name:{" "}
                      {this.state.selectedFile.name}
                  </p>

                  <p>
                      File Type:{" "}
                      {this.state.selectedFile.type}
                  </p>

                  <p>
                      Last Modified:{" "}
                      {this.state.selectedFile.lastModifiedDate.toDateString()}
                  </p>
                  <button onClick={this.onFileUpload}>
                    
                      Upload!
                  </button>
              </div>
              </center>
          );
      } else {
          return (
              <div>
                  <br />
                  <h4>
                     
                  </h4>
              </div>
          );
      }
  };

    render() {
        return (
            <div className="App">
                <Navbar />
                
            <div className="content">

            </div>
                <div>
                <h2><center>Explore the World with the Power of AI</center></h2>
                  <div>
                  {DisplayAnImage()}
                  </div>
                </div>
                

                <h3><center>AI Generated Image Description: </center></h3>

                <h4><center>{description} </center></h4>

                <h5><center>Image Upload</center></h5>
                <center> <input
                        type="file"
                        onChange={this.onFileChange}
                    />

{this.fileData()}
                    </center>


          </div>

        );
    }
}

export default App;
