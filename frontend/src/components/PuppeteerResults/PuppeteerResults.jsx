function PuppeteerResults({ data }) {
  if (!data) return null;

  return (
    <div>
      <h3>Puppeteer</h3>
      <p>Título: {data.title}</p>
      <p>Tiempo de carga: {data.loadTime}</p>
    </div>
  );
}

export default PuppeteerResults;
