import React, { useState, useEffect } from 'react';
import Spacer from './Spacer';
import MyGallery from './Gallery';

var name = "[name goes here]";
var uploader = "[username goes here]";
var description = "[description goes here]";

function Database() {
  const [imageUrls, setImageUrls] = useState([]);

  const [likes, setLikes] = useState({});

  const handleLike = (url) => {
    setLikes(prevLikes => ({
      ...prevLikes,
      [url]: (prevLikes[url] || 0) + 1 
    }));
  };

  return (
    <div className="content"> 

          <h2> <center>Global Image Database</center></h2>

          <Spacer size={20} />

          <h3><center>See what others have been posting!</center></h3>

          <Spacer size={20} />

    </div>
  );
}

export default Database;
