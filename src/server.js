const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// --- Persistencia de comentarios en archivo ---
const comentariosPath = path.join(__dirname, "comentarios.json");

// Leer comentarios desde archivo
function leerComentarios() {
  try {
    const data = fs.readFileSync(comentariosPath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Guardar comentarios en archivo
function guardarComentarios(comentarios) {
  fs.writeFileSync(comentariosPath, JSON.stringify(comentarios, null, 2));
}

// --- API de comentarios ---
app.get("/api/comentarios", (req, res) => {
  const comentarios = leerComentarios();
  res.json(comentarios);
});

app.post("/api/comentarios", (req, res) => {
  const { texto } = req.body;
  if (!texto) {
    return res.status(400).json({ error: "Texto requerido" });
  }
  const comentarios = leerComentarios();
  const nuevoComentario = { texto };
  comentarios.push(nuevoComentario);
  guardarComentarios(comentarios);
  res.status(201).json(nuevoComentario);
});

// --- Servir frontend ---
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Puerto dinámico para Render ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
