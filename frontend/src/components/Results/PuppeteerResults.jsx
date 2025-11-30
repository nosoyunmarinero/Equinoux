import "./Results.css";
function PuppeteerResults({ data }) {
  if (!data) return null;

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