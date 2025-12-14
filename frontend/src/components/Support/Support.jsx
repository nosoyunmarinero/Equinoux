import { useState } from "react";
import "./Support.css";
import supportImage from "../../images/qr.png";

function Support() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        className="footer__support-btn"
        onClick={() => setShowModal(true)}
      >
        Support 💙
      </button>

      {showModal && (
        <div className="support-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="support-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="support-modal-close" onClick={() => setShowModal(false)}>
              ✕
            </button>
            
            <h2 className="support-modal-title">Support this project :D</h2>
            <p>Buy me a Coffee ☕</p>
            
            <a 
              href="https://buymeacoffee.com/nosoyunmarinero" 
              target="_blank" 
              rel="noopener noreferrer"
              className="support-modal-link"
            >
              buymeacoffee.com/nosoyunmarinero
            </a>
            
            <img 
              src={supportImage} 
              alt="Support QR Code" 
              className="support-modal-image" 
            />
            
            <p className="support-modal-subtitle">Scan the QR code or click the link above</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Support;