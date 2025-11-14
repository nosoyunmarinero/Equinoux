const express = require('express');
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000" 
}));

app.get("/test-app", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

