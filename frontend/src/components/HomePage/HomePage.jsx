import { useState } from "react";
import axios from "axios";
import LighthouseResults from "../LighthouseResults/LighthouseResults";
import PuppeteerResults from "../PuppeteerResults/PuppeteerResults";
import AxeResults from "../AxeResults/AxeResults";
// import "./HomePage.css";

function HomePage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/full-analysis", { url });
      setResult(response.data);
    } catch (error) {
      console.error("Error al llamar al backend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-container">
      <h1 className="title">Web Analysis Dashboard</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="url"
          placeholder="https://www.test.com"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Run Test</button>
      </form>

      {loading && <span className="loading">⏳ Analizando...</span>}

      {result && (
        <div className="results-grid">
          <LighthouseResults data={result.lighthouse} />
          <PuppeteerResults data={result.puppeteer} />
          <AxeResults data={result.axe} />
        </div>
      )}
    </div>
  );
}

export default HomePage;
