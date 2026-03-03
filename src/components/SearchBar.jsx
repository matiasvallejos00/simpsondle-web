import { useState } from 'react';

const SearchBar = ({ characters = [], onGuess }) => {
  const [query, setQuery] = useState("");

  // Filtramos ignorando espacios y mayúsculas
  // Agregamos chequeo de Name/name por si la API devuelve mayúsculas
  const filtered = query.trim().length > 0
    ? characters.filter(c => {
      const characterName = c.name || c.Name || "";
      return characterName.toLowerCase().includes(query.toLowerCase().trim());
    }).slice(0, 6)
    : [];

  const handleSelect = (slug) => {
    onGuess(slug);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    const firstResult = filtered[0];
    if (e.key === 'Enter' && firstResult) {
      handleSelect(firstResult.slug || firstResult.Slug);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Escribe el nombre de un personaje..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      {filtered.length > 0 && (
        <ul className="results-list">
          {filtered.map(c => (
            <li key={c.slug || c.Slug} onClick={() => handleSelect(c.slug || c.Slug)}>
              <img
                // ✅ CORREGIDO: Usamos 'c' que es la variable del map, no 'item'
                // ✅ Agregamos fallback para Image (mayúscula)
                src={`https://simpsondle-api.onrender.com/Images/${c.image || c.Image}`}
                alt={c.name || c.Name}
                style={{
                  width: '40px',
                  height: '40px',
                  marginRight: '10px',
                  borderRadius: '4px',
                  objectFit: 'cover'
                }}
              />
              {c.name || c.Name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;