// songs.js
import song1 from "../audio/song1.mp3"
import song2 from "../audio/song2.mp3"

//thumbs
import thumb1 from "../images/thumbs/thumb1.jpg";
import thumb2 from "../images/thumbs/thumb2.jpg";


const songs = [
  {
    id: 1,
    name: "Reprocity",
    artist: "oxygenetiX",
    file: song1,
    thumbnail: thumb1,
    link: "https://www.youtube.com/watch?v=xYEzrr_P5hQ"
  },
  {
    id: 2,
    name: "Rolling Girl",
    artist: "Wowaka ft. Hatsune Miku",
    file: song2,
    thumbnail: thumb2,
    link: "https://youtu.be/vnw8zURAxkU?si=PoEliYYANJxsm9xm"
  },
];

export default songs;