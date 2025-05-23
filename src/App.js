// App.js
import React, { useState } from 'react';
import Pokedex from './componentes/Pokedex';
import ModoCombate from './componentes/ModoCombate';
import './componentes/estilos.css'; // Importa los estilos mejorados

const App = () => {
  const [modo, setModo] = useState('pokedex'); // 'pokedex' o 'combate'

  return (
    <div className="app-container"> {/* Contenedor general */}
      <nav className="app-nav"> {/* Barra de navegación */}
        <button
          onClick={() => setModo('pokedex')}
          className={`nav-button ${modo === 'pokedex' ? 'active' : ''}`} // Aplica clases
        >
          Pokédex
        </button>
        <button
          onClick={() => setModo('combate')}
          className={`nav-button ${modo === 'combate' ? 'active' : ''}`} // Aplica clases
        >
          Modo Combate
        </button>
      </nav>
      {/* Renderiza el componente según el modo */}
      {modo === 'pokedex' ? <Pokedex /> : <ModoCombate />}
    </div>
  );
};

export default App;