import "./Results.css";

function AxeResults({ data }) {
  if (!data) return null;

  const violationsByImpact = data.violations.reduce((acc, violation) => {
    const impact = violation.impact || 'unknown';
    if (!acc[impact]) {
      acc[impact] = [];
    }
    acc[impact].push(violation);
    return acc;
  }, {});

  const impactOrder = ['critical', 'serious', 'moderate', 'minor', 'unknown'];

  return (
    <div className="result-card">
      <h2 className="result-card__title">♿ Axe-core Results</h2>
      
      <div className="result-card__info">
        <div className="info-item">
          <span className="info-item__label">URL:</span>
          <span className="info-item__value">{data.url}</span>
        </div>
        <div className="info-item">
          <span className="info-item__label">Total Violations:</span>
          <span className="info-item__value">{data.violations.length}</span>
        </div>
      </div>
      
      {Object.keys(violationsByImpact).length > 0 ? (
        <div className="result-card__violations">
          <h3 className="result-card__subtitle">Violations by Impact</h3>
          {impactOrder.map(impact => {
            const violations = violationsByImpact[impact];
            if (!violations || violations.length === 0) return null;
            
            return (
              <div key={impact} className={`violation-group violation-group--${impact}`}>
                <h4 className="violation-group__title">
                  {impact.toUpperCase()} ({violations.length})
                </h4>
                <div className="violation-list">
                  {violations.map((violation, index) => (
                    <div key={index} className="violation-item">
                      <div className="violation-item__id">{violation.id}</div>
                      <div className="violation-item__description">
                        {violation.description}
                      </div>
                      <div className="violation-item__help">
                        <strong>Help:</strong> {violation.help}
                      </div>
                      {violation.nodes && violation.nodes.length > 0 && (
                        <div className="violation-item__nodes">
                          <div className="nodes-count">
                            Affected elements: {violation.nodes.length}
                          </div>
                          {violation.nodes.map((node, nodeIndex) => {
                            let nodeContent = '';
                            
                            if (typeof node === 'string') {
                              nodeContent = node;
                            } else if (node.html) {
                              nodeContent = node.html;
                            } else if (node.target) {
                              nodeContent = Array.isArray(node.target) 
                                ? node.target.join(' > ') 
                                : node.target;
                            } else {
                              nodeContent = JSON.stringify(node);
                            }
                            
                            return (
                              <div key={nodeIndex} className="node-preview">
                                {nodeContent.length > 100 
                                  ? nodeContent.substring(0, 100) + '...' 
                                  : nodeContent}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="result-card__empty">
          ✅ No accessibility violations found.
        </div>
      )}
    </div>
  );
}

export default AxeResults;