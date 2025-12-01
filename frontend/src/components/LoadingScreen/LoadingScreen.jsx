import "./LoadingScreen.css";

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <h2>⏳ Running analysis...</h2>
      <div className="spinner"></div>
    </div>
  );
}

export default LoadingScreen;