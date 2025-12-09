import React from 'react';
import './Player.css';

const Player = ({ 
  isPlaying, 
  songName, 
  artistName,
  thumbnail, 
  songLink, 
  currentTime, 
  duration, 
  onPlayPause, 
  onPrev,
  onNext, 
  onSeek 
}) => {
  
  // Formatea el tiempo en mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calcula el porcentaje de progreso
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="player">
      <div className="player__display">
        {/* Song Info con Thumbnail */}
        <div className="player__song-info">
          <div className="player__thumbnail">
            <img src={thumbnail} alt={songName} className="player__thumbnail-img" />
            <div className="player__icon-overlay">
            
            </div>
          </div>
          <div className="player__text">
            <p className="player__label">Now Playing</p>
            <p className="player__song-name">{songName}</p>
            <p className="player__artist">{artistName}</p>
            {/* Link externo */}
            <a 
              href={songLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="player__external-link"
            >
              🔗 Link to the song
            </a>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="player__progress-container">
          <span className="player__time">{formatTime(currentTime)}</span>
          <div className="player__progress-bar" onClick={onSeek}>
            <div 
              className="player__progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="player__time">{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="player__controls">
            <button className="player__control-btn" onClick={onPrev}>
            ⏮
          </button>
          <button className="player__control-btn" onClick={onPlayPause}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="player__control-btn" onClick={onNext}>
            ⏭
          </button>
        </div>

        {/* Visualizer */}
        {isPlaying && (
          <div className="player__visualizer">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;