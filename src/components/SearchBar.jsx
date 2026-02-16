import { useState } from 'react';

const SearchBar = ({ characters = [], onGuess }) => { // characters = [] evita que el .filter rompa si no hay datos
  const [query, setQuery] = useState("");

  // Filtramos ignorando espacios y mayúsculas
  const filtered = query.trim().length > 0
    ? characters.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase().trim())
    ).slice(0, 6)
    : [];

  const handleSelect = (slug) => {
    console.log("Enviando slug al App.jsx:", slug); // <-- Para que veas en la consola (F12) que el clic funciona
    onGuess(slug);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      handleSelect(filtered[0].slug);
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
            <li key={c.slug} onClick={() => handleSelect(c.slug)}>
              <img
                src={`http://localhost:5256/Images/${c.image}`}
                alt={c.name}
                style={{ width: '40px', height: '40px', marginRight: '10px', borderRadius: '4px' }}
              />
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;