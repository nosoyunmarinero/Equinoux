function PuppeteerResults({ data }) {
  if (!data) return null;

  return (
    <div className="card">
      <h2>Puppeteer Results</h2>
      <p><strong>URL:</strong> {data.url}</p>
      <p><strong>Título:</strong> {data.title}</p>
      <p><strong>Tiempo de carga:</strong> {data.loadTime}</p>
    </div>
  );
}

export default PuppeteerResults;