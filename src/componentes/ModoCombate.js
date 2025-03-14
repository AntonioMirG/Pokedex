// ModoCombate.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos.css';

const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

const multiplicadorTipos = {
  normal: { roca: 0.5, fantasma: 0, acero: 0.5 },
  lucha: { normal: 2, roca: 2, acero: 2, hielo: 2, siniestro: 2, volador: 0.5, veneno: 0.5, psíquico: 0.5, bicho: 0.5, hada: 0.5, fantasma: 0 },
  volador: { lucha: 2, bicho: 2, planta: 2, roca: 0.5, acero: 0.5, eléctrico: 0.5 },
  veneno: { planta: 2, hada: 2, veneno: 0.5, tierra: 0.5, roca: 0.5, fantasma: 0.5 },
  tierra: { veneno: 2, roca: 2, acero: 2, fuego: 2, eléctrico: 2, planta: 0.5, bicho: 0.5, volador: 0 },
  roca: { volador: 2, bicho: 2, fuego: 2, hielo: 2, lucha: 0.5, tierra: 0.5, acero: 0.5 },
  bicho: { planta: 2, psíquico: 2, siniestro: 2, lucha: 0.5, volador: 0.5, fuego: 0.5, fantasma: 0.5, acero: 0.5, hada: 0.5 },
  fantasma: { fantasma: 2, psíquico: 2, normal: 0, siniestro: 0.5 },
  acero: { roca: 2, hielo: 2, hada: 2, acero: 0.5, fuego: 0.5, agua: 0.5, eléctrico: 0.5 },
  fuego: { bicho: 2, acero: 2, planta: 2, hielo: 2, roca: 0.5, fuego: 0.5, agua: 0.5, dragón: 0.5 },
  agua: { tierra: 2, roca: 2, fuego: 2, agua: 0.5, planta: 0.5, dragón: 0.5 },
  planta: { agua: 2, tierra: 2, roca: 2, fuego: 0.5, planta: 0.5, veneno: 0.5, volador: 0.5, bicho: 0.5, acero: 0.5, dragón: 0.5 },
  eléctrico: { agua: 2, volador: 2, eléctrico: 0.5, planta: 0.5, dragón: 0.5, tierra: 0 },
  psíquico: { lucha: 2, veneno: 2, psíquico: 0.5, acero: 0.5, siniestro: 0 },
  hielo: { planta: 2, tierra: 2, volador: 2, dragón: 2, fuego: 0.5, agua: 0.5, hielo: 0.5, acero: 0.5 },
  dragón: { dragón: 2, acero: 0.5, hada: 0 },
  siniestro: { psíquico: 2, fantasma: 2, lucha: 0.5, siniestro: 0.5, hada: 0.5 },
  hada: { lucha: 2, dragón: 2, siniestro: 2, fuego: 0.5, veneno: 0.5, acero: 0.5 }
};

function calcularDaño(atacante, defensor) {
  const ataque = atacante.stats.find(s => s.stat.name === 'attack').base_stat;
  const defensa = defensor.stats.find(s => s.stat.name === 'defense')
    ? defensor.stats.find(s => s.stat.name === 'defense').base_stat
    : 50;
  const tipoAtacante = atacante.types[0].type.name;
  const tipoDefensor = defensor.types[0].type.name;
  let multiplicador = 1;
  if (
    multiplicadorTipos[tipoAtacante] &&
    multiplicadorTipos[tipoAtacante][tipoDefensor] !== undefined
  ) {
    multiplicador = multiplicadorTipos[tipoAtacante][tipoDefensor];
  }
  const daño = Math.max((ataque * multiplicador) - defensa, 1);
  return daño;
}

function simularCombate(pokemon1, pokemon2, setLog) {
  let hp1 = pokemon1.stats.find(s => s.stat.name === 'hp').base_stat;
  let hp2 = pokemon2.stats.find(s => s.stat.name === 'hp').base_stat;

  const velocidad1 = pokemon1.stats.find(s => s.stat.name === 'speed').base_stat;
  const velocidad2 = pokemon2.stats.find(s => s.stat.name === 'speed').base_stat;

  let turno = velocidad1 >= velocidad2 ? 1 : 2;
  let logCombate = [];

  while (hp1 > 0 && hp2 > 0) {
    if (turno === 1) {
      const daño = calcularDaño(pokemon1, pokemon2);
      hp2 -= daño;
      logCombate.push(`${pokemon1.name} hace ${daño} de daño a ${pokemon2.name}`);
      turno = 2;
    } else {
      const daño = calcularDaño(pokemon2, pokemon1);
      hp1 -= daño;
      logCombate.push(`${pokemon2.name} hace ${daño} de daño a ${pokemon1.name}`);
      turno = 1;
    }
  }

  setLog(logCombate);
  return hp1 > 0 ? pokemon1 : pokemon2;
}

const ModoCombate = () => {
  const [pokemones, setPokemones] = useState([]);
  const [seleccion1, setSeleccion1] = useState(null);
  const [seleccion2, setSeleccion2] = useState(null);
  const [ganador, setGanador] = useState(null);
  const [logCombate, setLogCombate] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchPokemones = async () => {
      try {
        const requests = [];
        for (let i = 1; i <= 493; i++) {
          requests.push(axios.get(`${API_URL}${i}`));
        }
        const responses = await Promise.all(requests);
        setPokemones(responses.map(res => res.data));
      } catch (error) {
        console.error('Error al obtener los Pokémon', error);
      }
    };
    fetchPokemones();
  }, []);

  // Filtrar Pokémon basado en la búsqueda
  const pokemonesFiltrados = pokemones.filter(pokemon => {
    const nombreCoincide = pokemon.name.toLowerCase().includes(busqueda.toLowerCase());
    const idCoincide = pokemon.id.toString().includes(busqueda);
    return nombreCoincide || idCoincide;
  });

  const iniciarCombate = () => {
    if (seleccion1 && seleccion2) {
      const ganadorCombate = simularCombate(seleccion1, seleccion2, setLogCombate);
      setGanador(ganadorCombate);
    }
  };

  return (
    <div className="container">
      <h1>Modo Combate</h1>

      {/* Campo de búsqueda */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre o ID"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '300px',
            marginBottom: '20px'
          }}
        />
      </div>

      {/* Mostrar el resultado del combate */}
      {ganador && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>¡El ganador es {ganador.name}!</h2>
        </div>
      )}

      {/* Mostrar el log del combate */}
      {logCombate.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>Log del combate</h3>
          <ul>
            {logCombate.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Botón de iniciar combate en la parte superior */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={iniciarCombate} disabled={!seleccion1 || !seleccion2}>
          Iniciar combate
        </button>
      </div>

      {/* Contenedor de Pokémon */}
      <div className="pokemon-grid">
        {pokemonesFiltrados.map(pokemon => (
          <div
            key={pokemon.id}
            style={{
              cursor: 'pointer',
              backgroundColor: '#2a2a2a',
              borderRadius: '10px',
              padding: '10px',
              margin: '10px',
              textAlign: 'center',
              width: '180px',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s',
              transform: seleccion1?.id === pokemon.id || seleccion2?.id === pokemon.id ? 'scale(1.1)' : 'scale(1)',
            }}
            onClick={() => {
              if (!seleccion1) {
                setSeleccion1(pokemon);
              } else if (!seleccion2) {
                setSeleccion2(pokemon);
              }
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#444'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2a2a2a'}
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              style={{ width: '100px', height: '100px' }}
            />
            <h3>{pokemon.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModoCombate;
