function AxeResults({ data }) {
  if (!data) return null;

  return (
    <div>
      <h3>Axe-core</h3>
      <ul>
        {data.violations.map((v, i) => (
          <li key={i}>
            <strong>{v.id}</strong> ({v.impact}) - {v.description}
            <br />
            Ejemplo: {v.nodes.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AxeResults;