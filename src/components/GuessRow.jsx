import React from 'react';

const GuessRow = ({ item }) => {
  // Función para obtener el valor sin importar si empieza con Mayús o minús (PascalCase vs camelCase)
  const getVal = (obj, prop) => {
    if (!obj) return "";
    return obj[prop] !== undefined
      ? obj[prop]
      : obj[prop.charAt(0).toUpperCase() + prop.slice(1)] || "";
  };

  const getBoxClass = (status) => {
    if (status === "correct") return "box correct";
    if (status && status.includes("partial")) return "box partial";
    if (status && status.includes("higher")) return "box higher";
    if (status && status.includes("lower")) return "box lower";
    return "box wrong";
  };

  // Función para renderizar la temporada con las flechas ⬆️ ⬇️
  const renderSeason = (status, value) => {
    return (
      <div className={getBoxClass(status)}>
        {value}
        {status && status.includes("higher") && " ⬆️"}
        {status && status.includes("lower") && " ⬇️"}
      </div>
    );
  };

  return (
    <div className="guess-row">
      {/* Columna de Personaje con Imagen */}
      <div className="cell character-cell">
        <img
          src={item.image}
          alt={item.name}
          style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '5px' }}
        />
        <span className="char-name">{item.name}</span>
      </div>

      {/* Atributos comparados con colores según el resultado de la API */}
      <div className={`cell ${item.results?.gender || 'wrong'}`}>
        {item.gender}
      </div>

      <div className={`cell ${item.results?.ageGroup || 'wrong'}`}>
        {item.ageGroup}
      </div>

      <div className={`cell ${item.results?.hair || 'wrong'}`}>
        {item.hair}
      </div>

      <div className={`cell ${item.results?.job || 'wrong'}`}>
        {item.job}
      </div>

      {/* Temporada con flechitas indicadoras */}
      <div className={`cell ${item.results?.firstSeason || 'wrong'}`}>
        {item.firstSeason}
        {item.results?.firstSeason === 'higher' ? ' ⬆️' : item.results?.firstSeason === 'lower' ? ' ⬇️' : ''}
      </div>

      <div className={`cell ${item.results?.extra || 'wrong'}`}>
        {item.extra}
      </div>

      <div className={`cell ${item.results?.status || 'wrong'}`}>
        {item.status}
      </div>
    </div>
  );
};

export default GuessRow;