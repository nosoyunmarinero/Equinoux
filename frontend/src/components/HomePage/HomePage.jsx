import { useState, useRef, useEffect } from "react";
import axios from "axios";
import LighthouseResults from "../Results/LighthouseResults";
import PuppeteerResults from "../Results/PuppeteerResults";
import AxeResults from "../Results/AxeResults";
import "./HomePage.css";

import ball from "../../images/ball.png";
import background2 from "../../images/background2.jpg";
import browser from "../../images/browser.png";
import girl from "../../images/girl.png";

import backgroundMusic from "../../audio/song1.mp3";

function HomePage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/full-analysis", { url });
      setResult(response.data);
    } catch (error) {
      console.error("❌ Error calling backend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef}
        src={backgroundMusic}
        loop
        autoPlay
        style={{ display: 'none' }} // 👈 Completely hidden
      />
      <section className="main">
        <div className="square">
          <div className="top">
            <img src={browser} alt="browser" className="browser-icon" />
            <div className="header">
              <h1 className="header__heading">Equinox<br/></h1>
              <h3 className="header__subheading">An App to test your website</h3>
            </div>
            <img  
              src={ball} 
              alt="music toggle" 
              className={`ball ${isPlaying ? 'ball--playing' : ''}`}
              onClick={toggleMusic} 
            />
          </div>
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
          <img src={girl} alt="girl" className="square__girl" />
          {loading && <span className="loading">⏳ Analyzing...</span>}
          {result && (
            <div className="results-grid">
              <LighthouseResults data={result.lighthouse} />
              <PuppeteerResults data={result.puppeteer} />
              <AxeResults data={result.axe} />
            </div>
          )}
        </div>
      </section>
      
      <div className="grass-container">
        <img src="../../images/grass2.png" alt="grass" className="grass" />
      </div>
    </>
  );
}

export default HomePage;
