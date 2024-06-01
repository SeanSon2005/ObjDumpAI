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
      <p>{model.description}</p>
      <Spacer size={30} />
      <button class='button' onClick={handleLikeClick}>
        Like ({likes})
      </button>
      <Spacer size={30} />
    </div>
  );
}

function App() {
  const models = [
    {
      name: 'Object Detector Pro',
      description: 'Accurately detects and classifies objects in images.',
    },
    {
      name: 'Scene Analyzer Plus',
      description: 'Analyzes images to understand scenes and context.',
    },
    // Add more models as needed
  ];

  return (
     <center>
    <div className="app">
    <Spacer size={30} />
      <h1>AI Image Detection Models</h1>
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

export default App;
