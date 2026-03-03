import { useEffect, useState } from 'react'
import axios from 'axios'
import GuessRow from './components/GuessRow'
import SearchBar from './components/SearchBar'
import './App.css'

function App() {
  const [history, setHistory] = useState([])
  const [allCharacters, setAllCharacters] = useState([])
  const [yesterdayChar, setYesterdayChar] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [nearMiss, setNearMiss] = useState(false)

  // URL de tu API en Render
  const API_URL = "https://simpsondle-api.onrender.com/api";
  const IMAGE_BASE_URL = "https://simpsondle-api.onrender.com/Images";

  const playSound = (type) => {
    const audio = new Audio(`/${type}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(err => console.error("Error al reproducir sonido:", err));
  };

  useEffect(() => {
    // 1. Cargar todos los personajes para el buscador
    axios.get(`${API_URL}/characters`)
      .then(res => setAllCharacters(res.data))
      .catch(err => console.error("Error cargando personajes", err))

    // 2. Obtener personaje de ayer
    axios.get(`${API_URL}/characters/yesterday`)
      .then(res => setYesterdayChar(res.data))
      .catch(err => console.warn("Aún no hay personaje de ayer disponible"))

    // 3. Lógica de Reinicio Diario y Carga de Historial Local
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('simpsondle_date');

    if (lastDate !== today) {
      localStorage.removeItem('simpsondle_attempts');
      localStorage.setItem('simpsondle_date', today);
      setHistory([]);
      setGameOver(false);
    } else {
      // Cargamos los slugs guardados hoy
      const savedSlugs = localStorage.getItem('simpsondle_attempts') || "";
      if (savedSlugs && allCharacters.length > 0) {
        // Aquí podrías reconstruir el historial si tuvieras el endpoint de historial
        // Por ahora, solo evitamos que se rompa al cargar
      }
    }
  }, [allCharacters.length]); // Se ejecuta de nuevo cuando cargan los personajes

  const handleGuess = async (selectedSlug) => {
    // Evitar duplicados
    const isAlreadyGuessed = history.some(item => (item.slug || item.Slug) === selectedSlug);
    if (isAlreadyGuessed || gameOver) return

    try {
      // 1. Enviamos el intento a la API
      const response = await axios.post(`${API_URL}/characters/guess`, { slug: selectedSlug })
      const resData = response.data;
      
      // 2. Buscamos la info del personaje en nuestra lista local
      const charInfo = allCharacters.find(c => (c.slug || c.Slug) === selectedSlug)
      if (!charInfo) return;

      // 3. Armamos el objeto para la tabla con la imagen de RENDER
      const newItem = {
        name: charInfo.name || charInfo.Name,
        slug: charInfo.slug || charInfo.Slug,
        image: `${IMAGE_BASE_URL}/${charInfo.image || charInfo.Image}`, 
        gender: charInfo.gender || charInfo.Gender,
        ageGroup: charInfo.ageGroup || charInfo.AgeGroup,
        hair: charInfo.hair || charInfo.Hair,
        job: charInfo.job || charInfo.Job,
        firstSeason: charInfo.firstSeason || charInfo.FirstSeason,
        status: charInfo.status || charInfo.Status,
        extra: charInfo.extra || charInfo.Extra || "",
        results: resData.results
      };

      // 4. Lógica de ganar o fallar
      const allAttributesMatch = Object.values(resData.results).every(val => val === "correct");

      if (allAttributesMatch && !resData.isCorrect) {
        setNearMiss(true);
        setTimeout(() => setNearMiss(false), 4000);
      }

      setHistory(prev => [newItem, ...prev])

      // Guardar en local storage
      const saved = localStorage.getItem('simpsondle_attempts')
      localStorage.setItem('simpsondle_attempts', saved ? `${saved},${selectedSlug}` : selectedSlug)

      if (resData.isCorrect) {
        playSound('win');
        setGameOver(true);
      } else {
        playSound('error');
      }

    } catch (err) {
      console.error("Error al procesar el intento", err)
    }
  }

  const availableCharacters = allCharacters.filter(char =>
    !history.some(h => (h.slug || h.Slug) === (char.slug || char.Slug))
  );

  return (
    <div className="App">
      <header className="header">
        <h1>Simpsondle</h1>
      </header>

      <main className="container">
        <div className="ad-container top-ad">
          <span className="ad-placeholder">Publicidad</span>
        </div>

        {yesterdayChar && (
          <div className="yesterday-banner">
            El personaje de ayer era <span className="orange-text">#{yesterdayChar.id || yesterdayChar.Id} {yesterdayChar.name || yesterdayChar.Name}</span>
          </div>
        )}

        <div className="legend-container">
          <h3 className="legend-title">Indicadores de color</h3>
          <div className="legend-items">
            <div className="legend-item"><div className="legend-box correct"></div>Correcto</div>
            <div className="legend-item"><div className="legend-box partial"></div>Parcial</div>
            <div className="legend-item"><div className="legend-box wrong"></div>Incorrecto</div>
            <div className="legend-item"><div className="legend-box higher">⬆️</div>Después de</div>
            <div className="legend-item"><div className="legend-box lower">⬇️</div>Antes de</div>
          </div>
        </div>

        <div className="attempts-counter">
          Intentos: <span>{history.length}</span>
        </div>

        {nearMiss && (
          <div className="near-miss-banner">
            ⚠️ ¡Tiene las mismas características, pero no es el personaje!
          </div>
        )}

        {!gameOver ? (
          <SearchBar
            characters={availableCharacters}
            onGuess={handleGuess}
          />
        ) : (
          <div className="win-banner">
            <h2>¡Excelente!</h2>
            <p>Adivinaste al personaje en <strong>{history.length}</strong> intentos.</p>

            <div className="donation-section">
              <p>¿Te gustó el juego? ¡Invitame una Duff!</p>
              <a
                href="https://link.mercadopago.com.ar/simpsondle"
                target="_blank"
                rel="noopener noreferrer"
                className="mp-button"
              >
                🍩 Donar con Mercado Pago
              </a>
            </div>

            <button
              className="retry-btn"
              onClick={() => {
                localStorage.removeItem('simpsondle_attempts');
                window.location.reload();
              }}
            >
              Probar de nuevo
            </button>
          </div>
        )}
//
        <div className="history-container">
          <div className="grid-labels">
            <span>Personaje</span>
            <span>Género</span>
            <span>Edad</span>
            <span>Pelo</span>
            <span>Trabajo</span>
            <span>Temporada</span>
            <span>Extra</span>
            <span>Estado</span>
          </div>
          <div className="history-list">
            {history.map((item, index) => (
              <GuessRow key={index} item={item} />
            ))}
          </div>
        </div>

        <div className="ad-container bottom-ad">
          <span className="ad-placeholder">Publicidad</span>
        </div>
      </main>
    </div>
  )
}

export default App;