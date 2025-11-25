import './AxeResults.css';

function AxeResults({ data }) {
  if (!data) return null;

  // Agrupar violaciones por impacto
  const violationsByImpact = data.violations.reduce((acc, violation) => {
    const impact = violation.impact || 'unknown';
    if (!acc[impact]) {
      acc[impact] = [];
    }
    acc[impact].push(violation);
    return acc;
  }, {});

  // Ordenar por severidad (critical > serious > moderate > minor)
  const impactOrder = ['critical', 'serious', 'moderate', 'minor', 'unknown'];

  return (
    <div className="axe-results">
      <h2>Axe-core Results</h2>
      <div className="url-info">
        <strong>URL:</strong> {data.url}
      </div>
      <div className="total-violations">
        Total violaciones: {data.violations.length}
      </div>
      
      {Object.keys(violationsByImpact).length > 0 ? (
        <div className="violations-container">
          <h3>Violaciones por Impacto</h3>
          {impactOrder.map(impact => {
            const violations = violationsByImpact[impact];
            if (!violations || violations.length === 0) return null;
            
            return (
              <div key={impact} className={`impact-group impact-${impact}`}>
                <h4>{impact.toUpperCase()} ({violations.length})</h4>
                <div className="violations-list">
                  {violations.map((violation, index) => (
                    <div key={index} className={`violation-item violation-${impact}`}>
                      <div className="violation-title">
                        {violation.id}
                      </div>
                      <div className="violation-description">
                        {violation.description}
                      </div>
                      <div className="violation-help">
                        <strong>Ayuda:</strong> {violation.help}
                      </div>
                      {violation.nodes && violation.nodes.length > 0 && (
                        <div className="affected-nodes">
                          <div className="affected-nodes-count">
                            Elementos afectados: {violation.nodes.length}
                          </div>
                          {violation.nodes.map((node, nodeIndex) => {
                            // Intentar obtener el contenido del nodo de diferentes formas
                            let nodeContent = '';
                            
                            if (typeof node === 'string') {
                              nodeContent = node;
                            } else if (node.html) {
                              nodeContent = node.html;
                            } else if (node.target) {
                              nodeContent = Array.isArray(node.target) ? node.target.join(' > ') : node.target;
                            } else {
                              nodeContent = JSON.stringify(node);
                            }
                            
                            return (
                              <div key={nodeIndex} className="node-preview">
                                {nodeContent.length > 100 ? nodeContent.substring(0, 100) + '...' : nodeContent}
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
        <div className="no-violations">
          No se encontraron violaciones de accesibilidad.
        </div>
      )}
    </div>
  );
}

export default AxeResults;