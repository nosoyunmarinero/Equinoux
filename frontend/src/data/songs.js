// songs.js
import { Link } from "react-router-dom";
import song1 from "../audio/song1.mp3"

//thumbs
import thumb1 from "../images/thumbs/thumb1.jpg";


const songs = [
  {
    id: 1,
    name: "Reprocity",
    artist: "oxygenetiX",
    file: song1,
    thumbnail: thumb1,
    link: "https://www.youtube.com/watch?v=xYEzrr_P5hQ"
  },
];

export default songs;