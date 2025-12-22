// Mapeo de nombres de regiones
const regionNames = {
    'ancash': 'Áncash',
    'amazonas': 'Amazonas',
    'apurimac': 'Apurímac',
    'arequipa': 'Arequipa',
    'ayacucho': 'Ayacucho',
    'cajamarca': 'Cajamarca',
    'callao': 'Callao',
    'cuzco': 'Cusco',
    'huancavelica': 'Huancavelica',
    'huanuco': 'Huánuco',
    'ica': 'Ica',
    'junin': 'Junín',
    'lalibertad': 'La Libertad',
    'lambayeque': 'Lambayeque',
    'lima': 'Lima',
    'loreto': 'Loreto',
    'madrededios': 'Madre de Dios',
    'moquegua': 'Moquegua',
    'pasco': 'Pasco',
    'piura': 'Piura',
    'puno': 'Puno',
    'sanmartin': 'San Martín',
    'tacna': 'Tacna',
    'tumbes': 'Tumbes',
    'ucayali': 'Ucayali'
};

// Mapa de coordenadas por región (latitud, longitud)
const regionCoords = {
    'Áncash': [-9.5276, -77.5260],
    'Amazonas': [-6.2319, -77.8739],
    'Apurímac': [-13.6361, -72.8791],
    'Arequipa': [-16.4090, -71.5375],
    'Ayacucho': [-13.1559, -74.2107],
    'Cajamarca': [-7.1626, -78.5123],
    'Callao': [-12.0561, -77.1475],
    'Cusco': [-13.5319, -71.9675],
    'Huancavelica': [-12.7740, -74.9710],
    'Huánuco': [-9.9300, -76.2429],
    'Ica': [-14.0687, -75.7297],
    'Junín': [-12.0640, -75.2040],
    'La Libertad': [-8.1091, -79.0215],
    'Lambayeque': [-6.7714, -79.8401],
    'Lima': [-12.0464, -77.0428],
    'Loreto': [-3.7437, -73.2516],
    'Madre de Dios': [-12.5956, -69.1896],
    'Moquegua': [-17.1918, -70.9359],
    'Pasco': [-10.6900, -76.2500],
    'Piura': [-5.1945, -80.6328],
    'Puno': [-15.8402, -70.0219],
    'San Martín': [-6.0262, -76.9745],
    'Tacna': [-18.0146, -70.2460],
    'Tumbes': [-3.5669, -80.4515],
    'Ucayali': [-8.3791, -74.5530]
};

function initializeMap(region) {
    const coords = regionCoords[region] || regionCoords['Lima'];
    const zoom = 12;
    // eliminar mapa anterior si existe
    if (window._leafletMap) {
        window._leafletMap.remove();
    }
    const map = L.map('map').setView(coords, zoom);
    window._leafletMap = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    L.marker(coords).addTo(map).bindPopup(region).openPopup();
}

// Obtener la región de la URL
function getRegionFromURL() {
    const params = new URLSearchParams(window.location.search);
    const regionParam = params.get('region');
    return regionNames[regionParam] || 'Lima';
}

const currentRegion = getRegionFromURL();

// Actualizar títulos
document.getElementById('titulo').textContent = `Turismo ${currentRegion}`;
document.getElementById('titulo2').textContent = currentRegion;
document.getElementById('page-title').textContent = `${currentRegion} - Turismo Perú`;

const btnInfoCiudad = document.getElementById('btnInfoCiudad');
const btnBuses = document.getElementById('btnBuses');
const btnLugares = document.getElementById('btnLugares');
const btnGastronomia = document.getElementById('btnGastronomia');
const btnHistoria = document.getElementById('btnHistoria');
const contentArea = document.getElementById('contentArea');
const navLinks = document.querySelectorAll('.main-nav a');
const btnReserva = document.getElementById('btnReserva');


// Eventos para los botones
btnInfoCiudad.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveLink(btnInfoCiudad);
    fetchCityInfo(currentRegion);
});

btnBuses.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveLink(btnBuses);
    fetchBusInfo(currentRegion);
});

btnLugares.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveLink(btnLugares);
    fetchTouristPlaces(currentRegion);
});

btnGastronomia.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveLink(btnGastronomia);
    fetchGastronomia(currentRegion);
});

btnHistoria.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveLink(btnHistoria);
    fetchHistoria(currentRegion);
});

btnReserva.addEventListener('click', (e) => {
  e.preventDefault();
  setActiveLink(btnReserva);
  abrirOverlay("overlayReserva");
});

function setActiveLink(activeElement) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeElement.classList.add('active');
}

// Función para información general de la ciudad
async function fetchCityInfo(region) {
    contentArea.innerHTML = '<div class="info-panel show"><div class="loading"> Cargando información de la ciudad</div></div>';
    
    try {
        const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(region + ' Perú departamento región')}&format=json&origin=*&srlimit=1`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.query.search.length === 0) {
            throw new Error('No se encontró información');
        }

        const pageId = searchData.query.search[0].pageid;
        const pageTitle = searchData.query.search[0].title;

        const contentUrl = `https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`;
        
        const contentResponse = await fetch(contentUrl);
        const contentData = await contentResponse.json();

        const extract = contentData.query.pages[pageId].extract;
        const pageUrl = `https://es.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;

        contentArea.innerHTML = `
            <div class="info-panel show">
                <h2> Información de ${region}</h2>
                <p>${extract.substring(0, 1500)}${extract.length > 1500 ? '...' : ''}</p>
                <a href="${pageUrl}" target="_blank" class="wiki-link"> Leer más en Wikipedia →</a>
            </div>
        `;
    } catch (error) {
        showError('No se pudo cargar la información de la ciudad');
    }
}

// Función para información de buses
async function fetchBusInfo(region) {
    contentArea.innerHTML = '<div class="info-panel show"><div class="loading"> Cargando información de transporte</div></div>';
    
    try {
        const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(region + ' transporte público buses')}&format=json&origin=*&srlimit=1`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.query.search.length === 0) {
            throw new Error('No se encontró información');
        }

        const pageId = searchData.query.search[0].pageid;
        const pageTitle = searchData.query.search[0].title;

        const contentUrl = `https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`;
        
        const contentResponse = await fetch(contentUrl);
        const contentData = await contentResponse.json();

        const extract = contentData.query.pages[pageId].extract;
        const pageUrl = `https://es.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;

        contentArea.innerHTML = `
            <div class="info-panel show">
                <h2> Sistema de Transporte en ${region}</h2>
                <p>${extract.substring(0, 1200)}${extract.length > 1200 ? '...' : ''}</p>
                
                <div class="bus-grid">
                    <div class="bus-card">
                        <h3> Buses Urbanos</h3>
                        <p>Sistema de transporte público que conecta toda la ciudad con diversas rutas y frecuencias.</p>
                    </div>
                    <div class="bus-card">
                        <h3>  Transporte Rápido</h3>
                        <p>Sistemas de transporte masivo como Metro, Metropolitano o trenes urbanos disponibles en la región.</p>
                    </div>
                    <div class="bus-card">
                        <h3> Taxis y Apps</h3>
                        <p>Servicio de taxis tradicionales y aplicaciones de transporte privado disponibles.</p>
                    </div>
                    <div class="bus-card">
                        <h3>🚲 Movilidad Alternativa</h3>
                        <p>Ciclovías, bicicletas compartidas y otras opciones de transporte sostenible.</p>
                    </div>
                </div>
                
                <a href="${pageUrl}" target="_blank" class="wiki-link"> Ver más información sobre transporte →</a>
            </div>
        `;
    } catch (error) {
        showError('No se pudo cargar la información de transporte');
    }
}

// Función para lugares turísticos
async function fetchTouristPlaces(region) {
    contentArea.innerHTML = '<div class="info-panel show"><div class="loading"> Cargando lugares turísticos</div></div>';
    
    try {
        const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(region + ' turismo lugares atracciones')}&format=json&origin=*&srlimit=1`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.query.search.length === 0) {
            throw new Error('No se encontró información');
        }

        const pageId = searchData.query.search[0].pageid;
        const pageTitle = searchData.query.search[0].title;

        const contentUrl = `https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`;
        
        const contentResponse = await fetch(contentUrl);
        const contentData = await contentResponse.json();

        const extract = contentData.query.pages[pageId].extract;
        const pageUrl = `https://es.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;

        contentArea.innerHTML = `
            <div class="info-panel show">
                <h2> Lugares Turísticos de ${region}</h2>
                <p>${extract.substring(0, 1200)}${extract.length > 1200 ? '...' : ''}</p>
                <a href="${pageUrl}" target="_blank" class="wiki-link"> Descubre más lugares →</a>
            </div>
        `;
    } catch (error) {
        showError('No se pudo cargar la información turística');
    }
}

// Función para gastronomía
async function fetchGastronomia(region) {
    contentArea.innerHTML = '<div class="info-panel show"><div class="loading"> Cargando información gastronómica</div></div>';
    
    try {
        const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(region + ' gastronomía comida platos típicos')}&format=json&origin=*&srlimit=1`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.query.search.length === 0) {
            throw new Error('No se encontró información');
        }

        const pageId = searchData.query.search[0].pageid;
        const pageTitle = searchData.query.search[0].title;

        const contentUrl = `https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`;
        
        const contentResponse = await fetch(contentUrl);
        const contentData = await contentResponse.json();

        const extract = contentData.query.pages[pageId].extract;
        const pageUrl = `https://es.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;

        contentArea.innerHTML = `
            <div class="info-panel show">
                <h2> Gastronomía de ${region}</h2>
                <p>${extract.substring(0, 1200)}${extract.length > 1200 ? '...' : ''}</p>
                <a href="${pageUrl}" target="_blank" class="wiki-link"> Explorar más sobre la gastronomía →</a>
            </div>
        `;
    } catch (error) {
        showError('No se pudo cargar la información gastronómica');
    }
}

// Función para historia
async function fetchHistoria(region) {
    contentArea.innerHTML = '<div class="info-panel show"><div class="loading"> Cargando historia</div></div>';
    
    try {
        const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(region + ' historia Perú')}&format=json&origin=*&srlimit=1`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.query.search.length === 0) {
            throw new Error('No se encontró información');
        }

        const pageId = searchData.query.search[0].pageid;
        const pageTitle = searchData.query.search[0].title;

        const contentUrl = `https://es.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`;
        
        const contentResponse = await fetch(contentUrl);
        const contentData = await contentResponse.json();

        const extract = contentData.query.pages[pageId].extract;
        const pageUrl = `https://es.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;

        contentArea.innerHTML = `
            <div class="info-panel show">
                <h2> Historia de ${region}</h2>
                <p>${extract.substring(0, 1500)}${extract.length > 1500 ? '...' : ''}</p>
                <a href="${pageUrl}" target="_blank" class="wiki-link"> Conocer más sobre la historia →</a>
            </div>
        `;
    } catch (error) {
        showError('No se pudo cargar la información histórica');
    }
}

function showError(message) {
    contentArea.innerHTML = `
        <div class="info-panel show">
            <div class="error-message">
                 ${message}. Por favor, intenta nuevamente.
            </div>
        </div>
    `;
}

// Cargar información de la ciudad por defecto al iniciar
window.addEventListener('load', () => {
    fetchCityInfo(currentRegion);
    setActiveLink(btnInfoCiudad);
    // Inicializar mapa dinámico según la región actual
    if (typeof initializeMap === 'function') {
        initializeMap(currentRegion);
    }
});
function confirmarReserva() {
  const fecha = document.getElementById("fechaVisita").value;

  if (!fecha) {
    alert("Selecciona una fecha para la visita");
    return;
  }

  alert(`Tu visita a ${currentRegion} fue reservada para el ${fecha}`);
  cerrarOverlay("overlayReserva");
}

function abrirOverlay(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) el.classList.add("activo");
}

function cerrarOverlay(overlayId) {
  const el = document.getElementById(overlayId);
  if (el) el.classList.remove("activo");
}

// Cerrar overlays con la tecla ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const overlays = document.querySelectorAll(".menu-overlay");
    overlays.forEach(overlay => {
      overlay.style.width = "0";
    });
  }
});

// Cerrar el overlay si hacen click fuera del contenido
document.querySelectorAll(".menu-overlay").forEach(overlay => {
  overlay.addEventListener("click", e => {
    if (e.target === overlay) {
      overlay.style.width = "0";
    }
  });
});
document.querySelectorAll(".contenido-menu").forEach(menu => {
  menu.addEventListener("click", e => {
    e.stopPropagation();
  });
});