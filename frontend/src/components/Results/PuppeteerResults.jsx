import "./Results.css";

function PuppeteerResults({ data }) {
  if (!data) return null;

  // 🔹 Error case
  if (data.error) {
    return (
      <div className="result-card">
        <h2 className="result-card__title">🎭 Puppeteer Results</h2>
        <div className="result-card__empty">
          ⚠️ {data.userMessage || "Could not run Puppeteer :("}
          <br />
          <small className="error-detail">{data.message}</small>
        </div>
      </div>
    );
  }

  // 🔹 Normal case
  return (
    <div className="result-card">
      <h2 className="result-card__title">🎭 Puppeteer Results</h2>
      
      <div className="result-card__info">
        <div className="info-item">
          <span className="info-item__label">URL:</span>
          <span className="info-item__value">{data.url}</span>
        </div>
        <div className="info-item">
          <span className="info-item__label">Title:</span>
          <span className="info-item__value">{data.title}</span>
        </div>
        <div className="info-item">
          <span className="info-item__label">Load Time:</span>
          <span className="info-item__value">{data.loadTime}</span>
        </div>
      </div>
    </div>
  );
}

export default PuppeteerResults;
