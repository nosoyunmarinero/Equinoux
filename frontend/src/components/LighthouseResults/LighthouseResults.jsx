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
          {Object.entries(issues).map(([category, categoryIssues]) => {
            const issueCount = Object.keys(categoryIssues).length;
            return (
              <div key={category}>
                <h4>{category} ({issueCount} issues)</h4>
                {issueCount > 0 ? (
                  <ul>
                    {Object.entries(categoryIssues).map(([issueKey, issue]) => (
                      <li key={issueKey}>
                        <strong>{issue.title}</strong>
                        <br />
                        {issue.description}
                        {issue.displayValue && (
                          <span style={{ color: '#ff6b6b' }}>
                            <br />Value: {issue.displayValue}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No issues found in {category}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LighthouseResults;
