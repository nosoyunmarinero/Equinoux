function LighthouseResults({ data }) {
  if (!data) return null;

  return (
    <div>
      <h3>Lighthouse</h3>
      <p>Performance: {data.performance}</p>
      <p>Accessibility: {data.accessibility}</p>
      <p>SEO: {data.seo}</p>
      <p>Best Practices: {data.bestPractices}</p>
    </div>
  );
}

export default LighthouseResults;