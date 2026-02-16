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
      <div className="box image">
        <img
          src={`http://localhost:5256/Images/${getVal(item, 'image')}`}
          alt={getVal(item, 'name')}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=S/D'; }}
        />
      </div>

      <div className={getBoxClass(item.results?.gender)}>
        {getVal(item, 'gender')}
      </div>

      <div className={getBoxClass(item.results?.ageGroup)}>
        {getVal(item, 'ageGroup')}
      </div>

      <div className={getBoxClass(item.results?.hair)}>
        {getVal(item, 'hair')}
      </div>

      <div className={getBoxClass(item.results?.job)}>
        {getVal(item, 'job')}
      </div>

      {/* Arreglo para T1 en lugar de Tundefined usando firstSeason o FirstSeason */}
      {renderSeason(item.results?.season, `T${getVal(item, 'firstSeason')}`)}
      <div className={getBoxClass(item.results?.extra)}>
        {getVal(item, 'extra')}
      </div>

      <div className={getBoxClass(item.results?.status)}>
        {getVal(item, 'status')}
      </div>
    </div>
  );
};

export default GuessRow;