import "./Results.css";

function LighthouseResults({ data }) {
  if (!data) return null;

  // 🔹 Error case
  if (data.error) {
    return (
      <div className="result-card">
        <h2 className="result-card__title">⚡ Lighthouse Results</h2>
        <div className="result-card__empty">
          ⚠️ {data.userMessage || "Could not run Lighthouse :("}
          <br />
          <small className="error-detail">{data.message}</small>
        </div>
      </div>
    );
  }

  // 🔹 Normal case
  const { performance, accessibility, seo, bestPractices, issues } = data;

  return (
    <div className="result-card">
      <h2 className="result-card__title">⚡ Lighthouse Results</h2>
      
      <div className="result-card__scores">
        <div className="score-item">
          <span className="score-item__label">Performance:</span>
          <span className="score-item__value">{performance}</span>
        </div>
        <div className="score-item">
          <span className="score-item__label">Accessibility:</span>
          <span className="score-item__value">{accessibility}</span>
        </div>
        <div className="score-item">
          <span className="score-item__label">SEO:</span>
          <span className="score-item__value">{seo}</span>
        </div>
        <div className="score-item">
          <span className="score-item__label">Best Practices:</span>
          <span className="score-item__value">{bestPractices}</span>
        </div>
      </div>

      {issues && Object.keys(issues).length > 0 && (
        <div className="result-card__issues">
          <h3 className="result-card__subtitle">Issues Found</h3>
          {Object.entries(issues).map(([category, categoryIssues]) => {
            const issueCount = Object.keys(categoryIssues).length;
            return (
              <div key={category} className="issue-category">
                <h4 className="issue-category__title">
                  {category} ({issueCount} issues)
                </h4>
                {issueCount > 0 ? (
                  <ul className="issue-list">
                    {Object.entries(categoryIssues).map(([issueKey, issue]) => (
                      <li key={issueKey} className="issue-list__item">
                        <strong className="issue-list__title">{issue.title}</strong>
                        <p className="issue-list__description">{issue.description}</p>
                        {issue.displayValue && (
                          <span className="issue-list__value">
                            Value: {issue.displayValue}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="issue-category__empty">No issues found in {category}</p>
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
