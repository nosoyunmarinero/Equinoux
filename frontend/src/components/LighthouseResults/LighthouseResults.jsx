// import "./LighthouseResults.css";

function LighthouseResults({ data }) {
  if (!data) return null;

  const { performance, accessibility, seo, bestPractices, issues } = data;

  return (
    <div className="card">
      <h2>Lighthouse Results</h2>
      <div className="scores">
        <p>⚡ Performance: {performance}</p>
        <p>♿ Accessibility: {accessibility}</p>
        <p>🔍 SEO: {seo}</p>
        <p>🛡️ Best Practices: {bestPractices}</p>
      </div>

      {issues && Object.keys(issues).length > 0 && (
        <div className="issues">
          <h3>Issues</h3>
          {Object.entries(issues).map(([category, items], i) => (
            <div key={i}>
              <h4>{category}</h4>
              <ul>
                {Array.isArray(items) && items.length > 0 ? (
                  items.map((issue, j) => (
                    <li key={j}>
                      {typeof issue === "string"
                        ? issue
                        : issue.description || JSON.stringify(issue)}
                    </li>
                  ))
                ) : (
                  <li>No issues in {category}</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LighthouseResults;
