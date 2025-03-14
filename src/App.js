// App.js
import React, { useState } from 'react';
import Pokedex from './componentes/Pokedex';
import ModoCombate from './componentes/ModoCombate';
import './componentes/estilos.css';

const App = () => {
  const [modo, setModo] = useState('pokedex'); // 'pokedex' o 'combate'

  return (
    <div>
      <nav style={{ padding: '10px', textAlign: 'center', background: '#333' }}>
        <button
          onClick={() => setModo('pokedex')}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            background: modo === 'pokedex' ? '#ffcc00' : '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Pokédex
        </button>
        <button
          onClick={() => setModo('combate')}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            background: modo === 'combate' ? '#ffcc00' : '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Modo Combate
        </button>
      </nav>
      {modo === 'pokedex' ? <Pokedex /> : <ModoCombate />}
    </div>
  );
};

export default App;
