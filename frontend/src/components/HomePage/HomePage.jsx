import { useState, useRef, useMemo, useEffect } from "react";
import axios from "axios";
import LighthouseResults from "../Results/LighthouseResults";
import PuppeteerResults from "../Results/PuppeteerResults";
import AxeResults from "../Results/AxeResults";
import "./HomePage.css";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import Player from "../Player/Player";

import ball from "../../images/ball.png";
import background2 from "../../images/background2.jpg";
import browser from "../../images/browser.png";
import girl from "../../images/girl.png";
import girl2 from "../../images/girl2.png";
import girl3 from "../../images/girl3.png";
import grass from "../../images/fire.png";

import songs from "../../data/songs";

function HomePage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [view, setView] = useState("form");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // 🔹 Al cargar la página, elegir canción aleatoria
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    setCurrentSongIndex(randomIndex);

    if (audioRef.current) {
      audioRef.current.src = songs[randomIndex].file;
      audioRef.current.load();
    }
  }, []);

  // 🔹 Actualiza el tiempo actual y duración
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  // 🔹 Función para reproducir canción aleatoria
  const playRandomSong = (autoPlay = false) => {
  let randomIndex = Math.floor(Math.random() * songs.length);

  // Evita repetir la misma canción dos veces seguidas
  while (randomIndex === currentSongIndex && songs.length > 1) {
    randomIndex = Math.floor(Math.random() * songs.length);
  }

  setCurrentSongIndex(randomIndex);
  setCurrentTime(0);

  const audio = audioRef.current;
  if (!audio) return;

  audio.src = songs[randomIndex].file;
  audio.load();

  // Usar canplay para garantizar que el navegador pueda iniciar
  const onCanPlay = () => {
    audio.removeEventListener("canplay", onCanPlay);
    if (autoPlay || isPlaying) {
      audio.play().catch((err) => console.log("Play interrupted:", err));
    }
  };
  audio.addEventListener("canplay", onCanPlay);
};

  // 🔹 Toggle del ball: abre/cierra + play/pause aleatorio
  const toggleBall = () => {
  if (showPlayer) {
    // Cerrar y pausar
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsClosing(true);
    setTimeout(() => {
      setShowPlayer(false);
      setIsClosing(false);
    }, 500);
  } else {
    // Abrir y reproducir una aleatoria de inmediato
    setIsPlaying(true);       // 👈 Primero marcamos reproducción
    setShowPlayer(true);
    playRandomSong(true);     // 👈 autoPlay activa la reproducción inmediata
  }
};
  // 🔹 Alterna play/pause dentro del Player
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        if (!showPlayer) {
          setShowPlayer(true);
        }
      }
    }
  };

  // 🔹 Siguiente canción → aleatoria
  const handleNext = () => {
    playRandomSong();
  };

  // 🔹 Canción anterior → aleatoria
  const handlePrevious = () => {
    playRandomSong();
  };

  // 🔹 Cuando termina una canción → pasa a otra aleatoria
  const handleSongEnd = () => {
    playRandomSong();
  };

  // 🔹 Seek - Cambia la posición de la canción
  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // 🔹 Envía la URL al backend y controla el flujo de vistas
  const handleSubmit = async (e) => {
    e.preventDefault();
    setView("loading");

    try {
      const response = await axios.post("http://localhost:3001/full-analysis", { url });
      setResult(response.data);
      setView("results");
    } catch (error) {
      console.error("❌ Error calling backend:", error);
      setView("form");
    }
  };

  // 🔹 Reinicia el flujo al formulario inicial
  const handleRestart = () => {
    setUrl("");
    setResult(null);
    setView("form");
  };

  // 🔹 Array con las 3 imágenes
  const girlImages = [girl, girl2, girl3];

  // 🔹 Elige una imagen aleatoria al cargar
  const randomGirl = useMemo(() => {
    return girlImages[Math.floor(Math.random() * girlImages.length)];
  }, []);

  return (
    <>
      {/* 🔹 Audio de fondo */}
      <audio
        ref={audioRef}
        src={songs[currentSongIndex].file}
        loop={false}
        onEnded={handleSongEnd}
        style={{ display: "none" }}
      />

      <section className="main">
        <div className="square">
          {/* 🔹 Header SIEMPRE visible */}
          <div className="top">
            <img src={browser} alt="browser" className="browser-icon" />
            <div className="header">
              <h1 className="header__heading">Equinoux<br /></h1>
              <h3 className="header__subheading">An App to test your website</h3>
            </div>
            <img
              src={ball}
              alt="music toggle"
              className={`ball ${isPlaying ? "ball--playing" : ""}`}
              onClick={toggleBall}
            />
          </div>

          {/* 🔹 Render condicional del contenido */}
          {view === "form" && (
            <>
              <div className="square__heading">
                <h2 className="square__heading_text">Enter your URL below</h2>
                <img src={background2} alt="background2" className="square__heading_background" />
              </div>
              <form onSubmit={handleSubmit} className="form">
                <input
                  type="url"
                  id="url"
                  placeholder="Enter a URL"
                  className="input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <button className="test-button" type="submit">Run Tests</button>
              </form>
              <img src={randomGirl} alt="girl" className="square__girl" />
            </>
          )}

          {view === "loading" && <LoadingScreen />}

          {view === "results" && result && (
            <div className="results-grid">
              <LighthouseResults data={result.lighthouse} />
              <PuppeteerResults data={result.puppeteer} />
              <AxeResults data={result.axe} />

              <div className="restart-container">
                <button className="restart-button" onClick={handleRestart}>
                  New Test
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="grass-container">
        <img src={grass} alt="grass" className="grass" />
      </div>

      {/* 🔹 Player - Controlado por showPlayer */}
      {showPlayer && (
        <Player
          isPlaying={isPlaying}
          songName={songs[currentSongIndex].name}
          artistName={songs[currentSongIndex].artist}
          thumbnail={songs[currentSongIndex].thumbnail}
          songLink={songs[currentSongIndex].link}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={toggleMusic}
          onNext={handleNext}
          onPrev={handlePrevious}
          onSeek={handleSeek}
          onClose={toggleBall}
          isClosing={isClosing}
        />
      )}

      {/* 🔹 Footer */}
      <footer className="footer">
        <p className="footer__credit">
          Created by{" "}
          <a
            href="https://nosoyunmarinero.github.io/francis-portfolio-frontend/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__link"
          >
            Francisco Romero
          </a>
        </p>
        <button className="footer__support-btn">
          Support 💙
        </button>
      </footer>
    </>
  );
}

export default HomePage;