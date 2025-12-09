import "./LoadingScreen.css";
import load from "../../images/load.png";

function LoadingScreen() {
 return (
    <div className="loading-container">
      <div className="image-wrapper">
        <div className="loading-content">
          <img src={load}  alt="load" className="loading-img"/>
        </div>
      </div>
      <div className="loading-text">
        Loading<span className="dots"></span>
      </div>
    </div>
  );
}

export default LoadingScreen;