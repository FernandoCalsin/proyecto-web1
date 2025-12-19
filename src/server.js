const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let comentarios = [];

app.get("/api/comentarios", (req, res) => {
  res.json(comentarios);
});

app.post("/api/comentarios", (req, res) => {
  const { texto } = req.body;
  if (!texto) {
    return res.status(400).json({ error: "Texto requerido" });
  }
  const nuevoComentario = { texto };
  comentarios.push(nuevoComentario);
  res.json(nuevoComentario);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
