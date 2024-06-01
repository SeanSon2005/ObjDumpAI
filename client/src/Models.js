import React, { useState } from 'react';
import Spacer from './Spacer';

function ModelCard({ model }) {
  const [likes, setLikes] = useState(0);

  const handleLikeClick = () => {
    setLikes(likes + 1);
  };

  return (
    <div className="model-card">
      <h3>{model.name}</h3>
      <h5>{model.user}</h5>
      <p>{model.description}</p>
      <Spacer size={30} />
      <button class='button2' onClick={handleLikeClick}>
        Like ({likes})
      </button>
      {"         "}
      <button class='button2' >
        <center>Download</center> 
      </button>
      <Spacer size={90} />
    </div>
  );
}

function ModelGallery() {
  const models = [
    {
      name: 'Model: Object Detector Pro',
      user: 'User: ExampleUser1',
      description: 'Description: Accurately detects and classifies objects in images.',
    },
    {
      name: 'Model: Scene Analyzer Plus',
      user: 'User: ExampleUser2',
      description: 'Description: Analyzes images to understand scenes and context.',
    },
    // Add more models as needed
  ];

  return (
     <center>
    <div className="app">
    <Spacer size={30} />
      <h6>AI Image Detection Models</h6>
      <Spacer size={30} />
      <div className="model-grid">
        {models.map((model, index) => (
          <ModelCard key={index} model={model} />
        ))}
      </div>
    </div>
    </center>
  );
}

export default ModelGallery;
