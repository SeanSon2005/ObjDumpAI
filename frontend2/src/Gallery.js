import ImageGallery from "react-image-gallery";

const images = [
  {
    original: "https://wallpapercave.com/wp/wp9637279.jpg",
    thumbnail: "https://wallpapercave.com/wp/wp9637279.jpg",
  },
  {
    original: "https://wallpapercave.com/wp/wp9637279.jpg",
    thumbnail: "https://wallpapercave.com/wp/wp9637279.jpg",
  },
  {
    original: "https://wallpapercave.com/wp/wp9637279.jpg",
    thumbnail: "https://wallpapercave.com/wp/wp9637279.jpg",
  },
];

export default function MyGallery() { 
    return (
      <ImageGallery 
        items={images} 
         
        // Additional ImageGallery props here (e.g., slideInterval, showFullscreenButton, etc.)
      />
    );
}
