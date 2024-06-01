import React, { useState, useEffect } from 'react';
import Spacer from './Spacer';
import MyGallery from './Gallery';

var name = "[name goes here]";
var uploader = "[username goes here]";
var description = "[description goes here]";

function Database() {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    // Provide an initial set of image URLs here
    const initialUrls = [
      'https://wallpapercave.com/wp/wp9637279.jpg',
      '',
      // ... more image URLs
    ];

    setImageUrls(initialUrls);
  }, []); 

  const [likes, setLikes] = useState({}); // Track likes per image

  const handleLike = (url) => {
    setLikes(prevLikes => ({
      ...prevLikes,
      [url]: (prevLikes[url] || 0) + 1 
    }));
  };

  return (
    <div className="content"> 
          <h6> <center>Uploaded Image Database</center></h6>
          <Spacer size={30} />

    <div className="image-gallery">
      { imageUrls
        .filter(url => url !== '') 
         .map((url, index) => (
        <div key={index} className="image-card">
          
          <img src={url} alt={`Image from ${url}`} />
          <Spacer size={30} />
          <h3><center>Image Name:  {name}</center></h3>
          <h3><center>Uploader:  {uploader}</center></h3>
          <h3><center>AI Generated Description:  {description}</center></h3>
          <Spacer size={30} />
          <center><button className="button" onClick={() => handleLike(url)}>
            Like ({likes[url] || 0})
          </button></center>
        </div>
      ))
      }
    </div>
    {MyGallery()}
    </div>
  );
}

export default Database;

// Previous version of Database:

/*import React, { useState } from "react"; 
import Spacer from './Spacer';

/*
import React, { useState, useEffect } from 'react';

function Database() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch image data from your API or database (e.g., using fetch, Axios)
    fetch('/api/images') // Replace with your actual API endpoint
      .then(res => res.json())
      .then(data => setImages(data));
  }, []);

  const handleLike = (imageId) => {
    // Update the like count for the image in your database
    // ... and update the 'images' state accordingly
    setImages(prevImages => 
      prevImages.map(img => 
        img.id === imageId ? { ...img, likes: img.likes + 1 } : img
      )
    );
  };

  return (
    <div className="image-gallery">

    <h6> <center>Database</center></h6>

      {images.map(image => (
        <div key={image.id} className="image-card">
          <img src={image.url} alt={image.description} />
          <div className="image-info">
            <p>{image.description}</p>
            <button onClick={() => handleLike(image.id)}>
              Like ({image.likes})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Database;
*/
