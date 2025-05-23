// ModoCombate.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './estilos.css';

const API_URL = 'https://pokeapi.co/api/v2/pokemon/';
const TOTAL_POKEMON = 493;

// (El objeto multiplicadorTipos permanece igual)
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
  const defensa = defensor.stats.find(s => s.stat.name === 'defense')?.base_stat || 50; // Usa optional chaining y valor por defecto
  const tipoAtacante = atacante.types[0].type.name;
  const tipoDefensor = defensor.types[0].type.name;
  let multiplicador = 1;

  if (multiplicadorTipos[tipoAtacante]?.[tipoDefensor] !== undefined) {
    multiplicador = multiplicadorTipos[tipoAtacante][tipoDefensor];
  }

  // Fórmula simplificada: 50 * (Ataque / Defensa) * Multiplicador * Random(0.85, 1)
  const poderBase = 50; // Poder base arbitrario para el ataque
  const randomFactor = Math.random() * (1 - 0.85) + 0.85;
  let daño = Math.floor(
      (((2 * 50 / 5 + 2) * poderBase * (ataque / defensa)) / 50 + 2) * multiplicador * randomFactor
  );
  daño = Math.max(daño, 1); // Asegura al menos 1 de daño

  console.log(`${atacante.name} (Atk: ${ataque}, Type: ${tipoAtacante}) vs ${defensor.name} (Def: ${defensa}, Type: ${tipoDefensor}) | Multi: ${multiplicador} | Damage: ${daño}`);
  return daño;
}


function simularCombate(pokemon1, pokemon2, setLog) {
  let hp1 = pokemon1.stats.find(s => s.stat.name === 'hp').base_stat;
  let hp2 = pokemon2.stats.find(s => s.stat.name === 'hp').base_stat;

  const velocidad1 = pokemon1.stats.find(s => s.stat.name === 'speed').base_stat;
  const velocidad2 = pokemon2.stats.find(s => s.stat.name === 'speed').base_stat;

  let p1 = { ...pokemon1, hp: hp1 };
  let p2 = { ...pokemon2, hp: hp2 };

  let turno = velocidad1 >= velocidad2 ? 1 : 2;
  let logCombate = [`¡Comienza el combate entre ${p1.name} (HP: ${p1.hp}) y ${p2.name} (HP: ${p2.hp})!`];

  while (p1.hp > 0 && p2.hp > 0) {
    if (turno === 1) {
      const daño = calcularDaño(p1, p2);
      p2.hp = Math.max(p2.hp - daño, 0);
      logCombate.push(`${p1.name} ataca. ${p2.name} recibe ${daño} de daño. (HP: ${p2.hp})`);
      turno = 2;
    } else {
      const daño = calcularDaño(p2, p1);
      p1.hp = Math.max(p1.hp - daño, 0);
      logCombate.push(`${p2.name} ataca. ${p1.name} recibe ${daño} de daño. (HP: ${p1.hp})`);
      turno = 1;
    }
  }

  const ganador = p1.hp > 0 ? p1 : p2;
  logCombate.push(`¡${ganador.name} ha ganado el combate!`);
  setLog(logCombate);
  return ganador;
}

const ModoCombate = () => {
  const [pokemones, setPokemones] = useState([]);
  const [seleccion1, setSeleccion1] = useState(null);
  const [seleccion2, setSeleccion2] = useState(null);
  const [ganador, setGanador] = useState(null);
  const [logCombate, setLogCombate] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemones = async () => {
        setLoading(true);
      try {
        const requests = [];
        for (let i = 1; i <= TOTAL_POKEMON; i++) {
          requests.push(axios.get(`${API_URL}${i}`));
        }
        const responses = await Promise.all(requests);
        setPokemones(responses.map(res => res.data));
      } catch (error) {
        console.error('Error al obtener los Pokémon', error);
      } finally {
          setLoading(false);
      }
    };
    fetchPokemones();
  }, []);

  const pokemonesFiltrados = pokemones.filter(pokemon =>
    pokemon.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    pokemon.id.toString().includes(busqueda)
  );

  const handleSelect = (pokemon) => {
    if (ganador) resetCombate(); // Reinicia si ya hubo un ganador

    if (seleccion1?.id === pokemon.id) {
        setSeleccion1(null);
    } else if (seleccion2?.id === pokemon.id) {
        setSeleccion2(null);
    } else if (!seleccion1) {
        setSeleccion1(pokemon);
    } else if (!seleccion2) {
        setSeleccion2(pokemon);
    }
  };

  const iniciarCombate = () => {
    if (seleccion1 && seleccion2) {
      setLogCombate([]); // Limpia el log anterior
      const ganadorCombate = simularCombate(seleccion1, seleccion2, setLogCombate);
      setGanador(ganadorCombate);
    }
  };

  const resetCombate = () => {
      setSeleccion1(null);
      setSeleccion2(null);
      setGanador(null);
      setLogCombate([]);
  }

  return (
    <div className="container combat-container">
      <h1>Modo Combate</h1>

      <div className="search-form">
          <input
            className="search-input"
            type="text"
            placeholder="Buscar Pokémon para combatir"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
      </div>

      <div className="combat-controls">
          <div className="combat-selection">
              <div className="selected-pokemon">
                  {seleccion1 ? (
                      <>
                          <img src={seleccion1.sprites.front_default} alt={seleccion1.name} />
                          <h3>{seleccion1.name}</h3>
                      </>
                  ) : <h3>Jugador 1</h3>}
              </div>
               <h2>VS</h2>
               <div className="selected-pokemon">
                  {seleccion2 ? (
                      <>
                          <img src={seleccion2.sprites.front_default} alt={seleccion2.name} />
                          <h3>{seleccion2.name}</h3>
                      </>
                  ) : <h3>Jugador 2</h3>}
              </div>
          </div>
          <button
            className="combat-button"
            onClick={iniciarCombate}
            disabled={!seleccion1 || !seleccion2 || ganador} // Deshabilita si falta selección o ya hay ganador
          >
            ¡Iniciar Combate!
          </button>
          {ganador && (
             <button
                className="combat-button"
                onClick={resetCombate}
                style={{ marginLeft: '10px', background: '#555' }}
             >
                Nuevo Combate
             </button>
          )}
      </div>

      {ganador && (
        <div className="combat-results">
          <h2>¡El ganador es {ganador.name.toUpperCase()}!</h2>
        </div>
      )}

      {logCombate.length > 0 && (
        <div className="combat-results">
          <h3>Log del Combate</h3>
          <div className="combat-log">
              <ul>
                {logCombate.map((log, index) => (
                  <li key={index}>{log}</li>
                ))}
              </ul>
          </div>
        </div>
      )}

      {loading ? (
        <p className="message">Cargando luchadores...</p>
      ) : (
          <div className="pokemon-grid">
            {pokemonesFiltrados.map(pokemon => {
                const isSelected = seleccion1?.id === pokemon.id || seleccion2?.id === pokemon.id;
                return (
                  <div
                    key={pokemon.id}
                    className={`pokemon-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(pokemon)}
                  >
                    <img
                      src={pokemon.sprites.front_default}
                      alt={pokemon.name}
                    />
                    <h3>{pokemon.name}</h3>
                    <p>ID: {pokemon.id}</p>
                  </div>
                );
            })}
          </div>
      )}
    </div>
  );
};

export default ModoCombate;