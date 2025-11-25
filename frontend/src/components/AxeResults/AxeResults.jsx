function AxeResults({ data }) {
  if (!data) return null;

  return (
    <div className="card">
      <h2>Axe-core Results</h2>
      <p><strong>URL:</strong> {data.url}</p>
      <h3>Violaciones encontradas:</h3>
      <ul>
        {data.violations.map((v, i) => (
          <li key={i}>
            <strong>{v.id}</strong> ({v.impact})  
            <br />
            {v.description}  
            <br />
            <em>Ayuda:</em> {v.help}  
            <br />
            <em>Ejemplos:</em> {v.nodes.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AxeResults;