import { useState, useEffect } from "react";
import "./LoadingScreen.css";
import load from "../../images/load.png";

function LoadingScreen() {
  const [currentMessage, setCurrentMessage] = useState("");

  // 🔹 Lista de mensajes motivacionales/informativos
 const messages = [
  "Diving into your site's performance... 🌊",
  "Testing how accessible your page really is ✨",
  "SEO check in progress... let's see how you rank! 🔍",
  "Looking for best practices (and finding them!) 💫",
  "Scanning every corner of your page structure 🏗️",
  "Measuring load times... tick tock! ⏱️",
  "Peeking at those security headers 🔒",
  "Analyzing all those images and resources 🖼️",
  "We're getting close now! Almost done ⭐",
  "Our robots are crunching the numbers 🤖",
  "Great things are worth the wait! ☁️",
  "Your results are being prepared... 📊",
  "Still analyzing... quality takes time! 🎯",
  "Just a moment longer, we're wrapping up! 🎁"
];

  useEffect(() => {
    // 🔹 Espera 20 segundos antes de mostrar el primer mensaje
    const initialTimeout = setTimeout(() => {
      setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);

      // 🔹 Después del primer mensaje, cambia cada 3 segundos
      const interval = setInterval(() => {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setCurrentMessage(randomMessage);
      }, 15000);

      // 🔹 Guarda el interval en el timeout para limpiarlo después
      return () => clearInterval(interval);
    }, 15000); // 15 segundos

    // 🔹 Limpia el timeout si el componente se desmonta antes de 20 segundos
    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <div className="loading-container">
      <div className="image-wrapper">
        <div className="loading-content">
          <img src={load} alt="load" className="loading-img"/>
        </div>
      </div>
      <div className="loading-text">
        Analysing<span className="dots"></span>
      </div>
      {/* 🔹 Mensaje dinámico (vacío los primeros 20 segundos) */}
      {currentMessage && <p>{currentMessage}</p>}
    </div>
  );
}

export default LoadingScreen;