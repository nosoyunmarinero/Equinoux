import { useState } from "react";
import axios from "axios";
import LighthouseResults from "./LighthouseResults/LighthouseResults";
import PuppeteerResults from "./PuppeteerResults/PuppeteerResults";
import AxeResults from "./AxeResults/AxeResults";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
      setLoading(true); // mostrar el span

    try {
      // Petición POST al backend
      const response = await axios.post("/full-analysis", { url });
      // Guardar la respuesta en el estado
      setResult(response.data);
    } catch (error) {
      console.error("Error al llamar al backend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Test App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Type a URL"
          minLength="5"
          maxLength="40"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Run test</button>
      </form>

      {loading && <span>⏳ Analizando, puede tardar algunos minutos...</span>}

      {/* Mostrar resultados */}
      {result && (
         <div>
          <h2>Resultados para {result.url}</h2>
          <LighthouseResults data={result.lighthouse} />
          <PuppeteerResults data={result.puppeteer} />
          <AxeResults data={result.axe} />
        </div>
      )}
    </div>
  );
}

export default App;
